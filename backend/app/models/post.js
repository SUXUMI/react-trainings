const mongoose = require('../database')

const schema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        created: {type: Date, required: true, default: Date.now},
        modified: {type: Date},
        userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    }
)

const PostModel = mongoose.model('Post', schema)

module.exports = PostModel