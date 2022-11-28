const express = require('express')
const chalk = require('chalk')

const app = express()
const router = express.Router()

router.get(
  '/',
  (req, res, next) => {
    console.log(chalk.green('处理根路径的路由中间件1'))
    next()
  },
  (req, res, next) => {
    console.log(chalk.green('处理根路径的路由中间件2'))
  }
)

app.use((req, res, next) => {
  console.log(chalk.red('我是应用层中间件'))
  next()
})

app.get(
  '/',
  (req, res, next) => {
    console.log(chalk.yellow('处理根路径的应用层中间件1'))
    next()
  },
  (req, res, next) => {
    console.log(chalk.yellow('处理根路径的应用层中间件2'))
    next()
  }
)

app.use('/user', router)

app.use((req, res) => {
  res.status(404).send('404 Not Found')
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Service Error')
})

app.listen('3000', () => {
  console.log(`Web服务器已成功运行在${chalk.magenta('http://127.0.0.1:3000')}`)
})
