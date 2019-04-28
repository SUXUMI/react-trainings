const UserModel = require('../models/user')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const Token = require('../assets/token')
const {app: {postsPerPage}} = require('../config')

const resolvers = {
    Query: {
        authors: async (parent, args, context, info) => {
            const authors = await UserModel.find().exec();

            const {includePosts, page} = args

            if (includePosts) {
                const p = authors.map(async author => {
                    return {
                        ...author.toObject(),
                        posts: await PostModel.find({userId: author._id}).exec()
                    }
                })

                const result = await Promise.all(p)

                return result
            }

            return authors
        },

        authorById: async (_, {id, ...args}) => (await UserModel.findById(id).exec()),
        
        posts: async (_, {page, ...args}, context, info) => {
            try {
                const skip = page * postsPerPage

                const sort = [['created', 'descending']]

                const posts = await PostModel.find().sort(sort).skip(skip).limit(postsPerPage).exec()

                if (!posts) {
                    return null
                }

                const p = posts.map(async post => {
                    return {
                        ...post.toObject(),
                        author: await UserModel.findById(post.userId).exec()
                    }
                })

                return await Promise.all(p)
            }
            catch (e) {
                throw new Error(e.message)
            }
        },

        postById: async (_, {id, ...args}) => {
            try {
                const post = await PostModel.findById(id).exec()

                if (!post) {
                    throw new Error('Invalid request')
                }

                result = {
                    ...post.toObject(),
                    author: await UserModel.findById(post.userId).exec(),
                    comments: await CommentModel.find({postId: post._id})
                }

                return result
            }
            catch (e) {
                throw new Error(e.message)
            }
        },
    },

    Mutation: {
        addPost: async (_, {title, description}, {token, ...context}, info) => {
            try {
                const user = await Token.getUserByToken(token)

                const post = new PostModel({
                    title,
                    description,
                    userId: user._id
                })

                await post.save();

                return {...post.toObject(), author: user}
            }
            catch (e) {
                throw new Error(e.message)
            }
        },
        
        updatePost: async (_, {_id, title, description}, {token, ...context}, info) => {
            // add post for authorized user only!
            try {
                const user = await Token.getUserByToken(token)

                const post = await PostModel.findOne({_id})

                if (!post) {
                    throw new Error('Invalid request (post not found)')
                }

                if (!user._id.equals(post.userId)) {
                    throw new Error('Invalid request (wrong author)')
                }

                const result = await PostModel.updateOne({_id}, {test: "test", title, description})

                if (!result) {
                    throw new Error('Unable to save the post')
                }

                return {...post.toObject(), title, description, author: user}
            }
            catch (e) {
                throw new Error(e.message)
            }
        },
        
        comment: async (_, {data: {postId, authorName, comment}}, {token, ...context}, info) => {
            // add post for authorized user only!
            try {
                const post = await PostModel.findOne({_id: postId})

                if (!post) {
                    throw new Error('Invalid request (post not found)')
                }

                const _comment = await CommentModel.create({authorName, comment})

                if (!_comment) {
                    throw new Error('Unable to save comment')
                }

                return {..._comment.toObject()}
            }
            catch (e) {
                throw new Error(e.message)
            }
        },
    }
}

module.exports = resolvers