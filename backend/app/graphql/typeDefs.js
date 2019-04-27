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
        created: String
        modified: String
        userId: String
        author: Author
        comments: [Comment]
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

    type Query {
        authors(includePosts: Boolean = false, page: Int = 0): [Author]
        authorById(id: ID!): Author
        posts: [Post]
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