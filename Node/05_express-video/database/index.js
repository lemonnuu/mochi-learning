const mongoose = require('mongoose')

const database = 'express-video'

const main = async () => {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)
}

main()
  .then(() => {
    console.log('数据库连接成功✔️')
  })
  .catch(() => {
    console.log('数据库连接失败❌')
  })

module.exports = {
  User: mongoose.model('user', require('./userSchema')),
}
