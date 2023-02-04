const Router = require('@koa/router')
const router = new Router({ prefix: '/api/v1' })
const usersController = require('../controller/usersController')

router.get('/users', usersController.index)

module.exports = router
