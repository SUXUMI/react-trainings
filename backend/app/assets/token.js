const jwt = require('jsonwebtoken')
const {token: {secret, issuer, audience}} = require('../config')
const UserModel = require('../models/user')

const Token = {
    generate:
        payload =>
            jwt.sign(payload, secret, {
                issuer,
                audience,
            }),
    
    verify: 
        token =>
            jwt.verify(token, secret, {
                issuer,
                audience,
            }),

    /**
     * Gets User by token OR throws an error
     * 
     * @param  {} token
     */
    getUserByToken: async token => {
        let payload = null

        try {
            payload = Token.verify(token)
        } catch (e) {
            throw new Error('Invalid token')
        }

        const user = await UserModel.findOne({ _id: payload.id })

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }
}

module.exports = Token