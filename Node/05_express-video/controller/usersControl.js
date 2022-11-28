const { User } = require('../database/index')
const { createToken } = require('../utils/jwt')

// 注册 - POST
exports.register = async (req, res, next) => {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  const user = dbBack.toJSON()
  delete user.password
  res.send(user)
}

// 登录 - POST
exports.login = async (req, res, next) => {
  console.log(req.body)
  const dbBack = await User.findOne(req.body)
  if (!dbBack) {
    return res.status(402).json({ error: '邮箱或密码不正确!' })
  }
  const user = dbBack.toJSON()
  user.token = await createToken(user)
  res.send(user)
}

// 用户列表 - GET
exports.list = async (req, res, next) => {
  console.log(req.method)
  res.send(req.userInfo)
}

// 用户注销 - DELETE
exports.delete = async (req, res, next) => {
  console.log(req.method)
  res.send(req.url)
}
