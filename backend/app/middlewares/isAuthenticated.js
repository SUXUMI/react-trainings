const UserModel = require('../models/user')
const Token = require('../assets/token')

const isAuthenticated = async (req, res, next) => {
  try {
      const user = Token.getUserByToken(token)

      req.user = user

      next()
    }
    catch (e) {
      res.status(500)
      res.json({
      error: e.message,
    })
  }
}

module.exports = isAuthenticated