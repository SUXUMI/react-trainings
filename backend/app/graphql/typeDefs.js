const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Author {
        _id: ID
        firstName: String
        lastName: String
        email: String
        created: String
        modified: String
        posts: [Post]
    }

    type Post {
        _id: ID
        title: String
        description: String
        shortDescription: String
        created: String
        modified: String
        userId: String
        author: Author
        comments: [Comment]
        commentsCount: Int
    }

    type Comment {
        _id: ID
        authorName: String
        comment: String
        created: String
    }

    input CommentInput {
        postId: ID!
        authorName: String!
        comment: String!
    }

    type PostsResponse {
        page: Int!
        totalPages: Int!
        totalPosts: Int!
        list: [Post]
    }

    type Query {
        authors(includePosts: Boolean = false, page: Int = 0): [Author]
        authorById(id: ID!): Author
        posts(page: Int = 1, authorId: ID = null): PostsResponse
        postById(id: ID!): Post
    }

    type Mutation {
        addPost(
            title: String!
            description: String!
        ): Post!
        updatePost(
            _id: ID!
            title: String!
            description: String!
        ): Post!
        comment(data: CommentInput): Comment!
    }
`
module.exports = typeDefs