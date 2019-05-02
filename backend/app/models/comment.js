const mongoose = require('../database')

const schema = mongoose.Schema(
    {
        authorName: {type: String, required: true},
        comment: {type: String, required: true},
        created: {type: Date, required: true, default: Date.now},
        modified: {type: Date},
        postId: {type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true},
    }
)

const CommentModel = mongoose.model('Comment', schema)

module.exports = CommentModel