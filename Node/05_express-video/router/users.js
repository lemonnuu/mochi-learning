const express = require('express')
const usersControl = require('../controller/usersControl')
const userValidator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()

router
  .post('/registers', userValidator.register, usersControl.register)
  .post('/logins', userValidator.login, usersControl.login)
  .get('/lists', verifyToken, usersControl.list)
  .delete('/', usersControl.delete)

module.exports = router
