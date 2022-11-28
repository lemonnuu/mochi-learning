const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/index')
const { promisify } = require('util')
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

const createToken = async (userInfo) => {
  return await sign({ userInfo }, jwtSecret, { expiresIn: 60 * 60 })
}

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization
  token = token ? token.split('Bearer ')[1] : null
  if (!token) return res.status(402).json({ error: '请传入 token' })
  try {
    req.userInfo = (await verify(token, jwtSecret)).userInfo
    next()
  } catch (error) {
    return res.status(402).json({ error: '无效的 token' })
  }
}

module.exports = {
  createToken,
  verifyToken,
}

// const token = jwt.sign({ foo: 'bar' }, jwtSecret)
// console.log(token)
// const res = jwt.verify(
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2NjkzODg1MjJ9.Gw9Co3hcVvyKsS3WqRWHRpRjqo3gwa35W72GR_TmiJ4',
//   jwtSecret
// )
// console.log(res)
