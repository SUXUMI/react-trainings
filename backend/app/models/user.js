const mongoose = require('../database')

const schema = mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        created: {type: Date, required: true, default: Date.now},
        modified: {type: Date},
    },
    {
        toObject: {
            transform: function (doc, ret) {
                delete ret.password;
            }
        },
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
            }
        }
    }
)

const UserModel = mongoose.model('User', schema)

module.exports = UserModel