const { validationResult } = require('express-validator')

/**
 * 数据校验中间件
 * @param {Array<validator>} validators
 * @returns
 */
module.exports = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    res.status(400).json({ errors: errors.array() })
  }
}
