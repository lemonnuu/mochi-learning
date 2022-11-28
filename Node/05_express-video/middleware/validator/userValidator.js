const { body } = require('express-validator')
const validate = require('./validate')
const { User } = require('../../database/index')

exports.register = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .bail()
    .isLength({ min: 2, max: 12 })
    .withMessage('用户名长度不能小于 2 位且不能超过 12 位')
    .bail()
    .matches(/^\w{2,12}$/)
    .withMessage('用户名只能由数字、字母、下划线组成'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .bail()
    .isLength({ min: 6, max: 15 })
    .withMessage('密码长度不能小于 6 位且不能超过 15 位')
    .matches(/^\w{6,15}$/)
    .withMessage('密码只能由数字、字母、下划线组成'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail()
    .normalizeEmail()
    .custom(async (val) => {
      const emailValidate = await User.findOne({ email: val })
      if (emailValidate) {
        return Promise.reject('邮箱已被注册')
      }
    }),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('手机号不能为空')
    .bail()
    .matches(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)
    .withMessage('手机格式不正确')
    .bail()
    .normalizeEmail()
    .custom(async (val) => {
      const phoneValidate = await User.findOne({ phone: val })
      if (phoneValidate) {
        return Promise.reject('手机已被注册')
      }
    }),
])

exports.login = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail()
    .normalizeEmail()
    .custom(async (val) => {
      const emailValidate = await User.findOne({ email: val })
      if (!emailValidate) {
        return Promise.reject('邮箱未注册')
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('密码不能为空')
    .bail()
    .isLength({ min: 6, max: 15 })
    .withMessage('密码长度不能小于 6 位且不能超过 15 位')
    .matches(/^\w{6,15}$/)
    .withMessage('密码只能由数字、字母、下划线组成'),
])
