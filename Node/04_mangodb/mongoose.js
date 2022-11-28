const mongoose = require('mongoose')

const database = 'mytest'

const main = async () => {
  mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)
  const ccSchema = new mongoose.Schema({
    x: Number,
    y: Number,
  })
  const cc = mongoose.model('Cc', ccSchema)
  const ccModel = new cc({ x: 1, y: 2 })
  const dbBack = await ccModel.save()
  console.log(dbBack)
}

main()
  .then(() => {
    console.log('数据库连接成功✔️')
  })
  .catch(() => {
    console.log('数据库连接失败❌')
  })
