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
        
        posts: async (_, {page, authorId, ...args}, context, info) => {
            try {
                const skip = ((page || 1) - 1) * postsPerPage

                const sort = [['created', 'descending']]

                let totalPosts

                let posts

                // https://mongoosejs.com/docs/api.html
                //DeprecationWarning: collection.count is deprecated, 
                // and will be removed in a future version. 
                // Use collection.countDocuments or 
                // collection.estimatedDocumentCount instead
                // await PostModel.find().count()
                if (authorId) {
                    totalPosts = await PostModel.find({userId: authorId}).count()
                    
                    posts = await PostModel
                        .find({userId: authorId})
                        .sort(sort)
                        .skip(skip)
                        .limit(postsPerPage)
                        .exec()
                }
                else {
                    totalPosts = await PostModel.find().count()
                    
                    posts = await PostModel
                        .find()
                        .sort(sort)
                        .skip(skip)
                        .limit(postsPerPage)
                        .exec()
                }

                // totalPosts = await PostModel.find(() => (
                //     authorId ? {userId: authorId} : {userId: authorId}
                // )).count()

                const totalPages = Math.ceil(totalPosts / postsPerPage);

                let list = {}

                if (posts) {
                    const p = posts.map(async post => {
                        return {
                            ...post.toObject(),
                            shortDescription: post.description.substring(0, 256),
                            author: await UserModel.findById(post.userId).exec(),
                            commentsCount: await CommentModel.find({postId: post._id}).count(),
                        }
                    })

                    list = await Promise.all(p)
                }


                return {page, totalPages, totalPosts, list }
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
                    comments: await CommentModel.find({postId: post._id}),
                    commentsCount: await CommentModel.find({postId: post._id}).count(),
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

                const _comment = await CommentModel.create({postId, authorName, comment})

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