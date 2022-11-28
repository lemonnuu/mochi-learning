const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router/index')
const chalk = require('chalk')

const app = express()
const PORT = process.env.PORT || 3000

// 基础中间件
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded())

// 路由中间件
app.use('/api/v1', router)

app.listen(PORT, () => {
  console.log(`Server is running at ${chalk.magenta.underline(`http://localhost:${PORT}`)}`)
})
