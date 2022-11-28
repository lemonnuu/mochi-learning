const { MongoClient } = require('mongodb')

const client = new MongoClient('mongodb://127.0.0.1:27017')

const main = async () => {
  await client.connect()
  const db = client.db('mytest')
  const cc = db.collection('cc')
  const cursor = cc.find()
  console.log(await cursor.toArray())
  console.log(await cc.findOne({ x: 11 }))
}

main().finally(() => {
  client.close()
})
