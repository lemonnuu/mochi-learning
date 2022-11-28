# MongoDB

MongoDB 是一个文档数据库, 由 C++ 语言编写。它是一个介于关系型数据库和非关系型数据库之间的产品, 是非关系型数据库当中功能最丰富, 最像关系型数据库的。

## 安装

MongoDB 次版本为奇数表示是测试版, 为偶数表示是稳定版, 建议安装稳定版。此安装版本为 MongoDB@6.0.3。

[MongoDB](https://www.mongodb.com/try/download/community) 版本 6 及其以上和版本 5 的安装有些差异。MongoDB6 不再内置 MongoDB shell, 也就是以前的 `mongo` 命令不能使用了, 需要手动安装 [MongoDB Shell](https://www.mongodb.com/try/download/shell) 才能在使用命令行工具。

在安装 MongoDB 时可以选择 custom 自定义安装路径, 需要注意的是不要勾选安装 MongoDB Compass, 后面会安装更合适的 Navicat Premium。

在安装 MongoDB shell 时只需下载解压即可, 可以把其 bin 目录下的文件丢入 MongoDB 的 bin 目录下, 然后再为 bin 目录添加 path 环境变量即可。path 环境变量的查找要求终端具有管理员权限。

## 基本命令

### 连接 MongoDB

以管理员权限打开终端, 执行：

```shell
mongosh
```

### 查看所有数据库

```shell
show dbs
```

注：admin、config 与 local 为 MongoDB 内置数据库。

### 查看当前数据库

```shell
db
```

### 创建数据库/集合

MongoDB 创建『数据库/集合』没有显式的指令, 只要往数据库里面塞了值, 数据库就自动创建

```shell
use mytest
db.cc.insertOne({x: 1, y: 2})
```

### 退出数据库

```shell
exit;
# 或
quit();
# 或者直接暴力 Ctrl + C
```

### 删除数据库

MongoDB 删除数据库只能切换到当前数据库, 也就是说, MongoDB 的数据库只能自杀。

```shell
db.dropDatabase()
```

### 删除集合

```shell
db.cc.drop()
```

### 向集合中插入数据

向集合中插入一条数据可使用 `insertOne()`, 插入多条数据可使用 `insertMany()`

```shell
db.cc.insertOne({x: 1, y: 2})
db.cc.insertMany([
  {x: 2, y: 4},
  {x: 4, y: 8}
])
```

### 查找内容

查找所有内容

```shell
db.cc.find()
```

查找指定内容需要给 `find()` 方法传递一个对象, `$gt` 表示大于, `$lt` 表示小于

```shell
db.cc.find({x: {$gt: 2}})
```

如果只想获取一条数据, 使用 `findOne()` 即可

```shell
db.cc.findOne({x: {$lt: 2}})
```

### 更新内容

如果想更新一条数据使用 `updateOne()`, 更新多条使用 `updateMany()`, 注意只能更新 value, 不能更新 key, 且需要使用 `$set` 赋值

```shell
db.cc.updateOne({x: 1}, {$set: {x: 11, y: 22}})
```

### 删除内容

如果想删除一条内容可以使用 `deleteOne()`, 删除多条使用 `deleteMany()`

```shell
db.cc.deleteOne({x: 2})
```

## Node.js 中使用 MongoDB

### mongodb

Node.js 中操作 MongoDB 需要使用 [mongodb](https://www.npmjs.com/package/mongodb) 库。

```shell
npm install mongodb
```

```js
const { MongoClient } = require('mongodb')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

// Database Name
const dbName = 'myProject'

async function main() {
  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection('documents')
  // the following code examples can be pasted here...
  const allData = await cc.find()
  console.log(await allData.toArray())
  return 'done.'
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
```

在使用完 main 方法后一定一定要把数据库连接关闭。

`find()` 方法返回的是游标, 想要得到实际的数据还需要 `await data.toArray()`。

### mongoose

mongoose 是在 mongodb 基础上二次封装的库, 有着更友好的 API, 实际开发中基本是使用它。

```shell
npm install mongoose
```

与 mongodb 不同, mongoose 在连接 url 中就需要指定需要连接的数据库。

```js
const mongoose = require('mongoose')

const database = 'mytest'

const main = async () => {
  mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)
}

main()
  .then(() => {
    console.log('数据库连接成功✔️')
  })
  .catch(() => {
    console.log('数据库连接失败❌')
  })
```

如若想对数据库的集合进行操作, 需要：

1. 创建 Schema, 表示集合结构, 如：`const userSchema = new mongoose.Schema({username: String})`
2. 定义 Model, 表示集合模型, 如：`const User = mongoose.model('user', userSchema)`
3. 实例化 Model, 如：`const userModel = new User({username: 'abc'})`
4. 操作都是通过实例化的 Model 完成, 如 `await userModel.save()`

```js
const ccSchema = new mongoose.Schema({
  x: Number,
  y: Number,
})
const cc = mongoose.model('cc', ccSchema)
const ccModel = new cc({ x: 1, y: 2 })
const dbBack = await ccModel.save()
console.log(dbBack)
```

需要注意的是, 定义 Model 时, 第一个参数是集合的参数名称, 一般是大写, mongoose 会自动查找其复数形式。例如：

```js
// 实际操作的集合是 Tickets
const MyModel = mongoose.model('Ticket', mySchema)
```

## 使用场景

1. 对数据处理性能有较高要求
2. 需要借助缓存层来处理数据
3. 需要高度的伸缩性
