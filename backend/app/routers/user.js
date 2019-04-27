const { Router } = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated')

const userRouter = new Router()

userRouter.get('/me', isAuthenticated, async (req, res) => {
  try {
    res.json({
      me: req.user,
    })
  } catch (e) {
    res.status(500)
    res.json({
      error: e.message,
    })
  }
})

module.exports = userRouter