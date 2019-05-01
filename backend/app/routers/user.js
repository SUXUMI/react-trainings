const { Router } = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt-nodejs')
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

userRouter.post('/me', isAuthenticated, async (req, res) => {
  try {
    const updateUserData = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.email.trim(),
      modified: Date.now(),
    }
    
    if (req.body.password && req.body.password.trim().length) {
      const newPassword = req.body.password.trim()
      const newPasswordCrypt = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8))
      
      updateUserData.password = newPasswordCrypt
    }

    const result = await UserModel.updateOne({_id: req.user._id}, updateUserData)

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