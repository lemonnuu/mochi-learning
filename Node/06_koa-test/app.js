const Koa = require('koa')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const router = require('./router')

const app = new Koa()

app.use(cors()).use(koaBody()).use(router.routes())

app.on('error', (error, ctx) => {
  console.log(error)
  ctx.body = 'Server Err' + error
})

app.listen(3000, () => {
  console.log('服务启动在http://127.0.0.1:3000')
})
