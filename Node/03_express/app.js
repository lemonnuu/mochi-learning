const express = require('express')
const chalk = require('chalk')
const fs = require('fs/promises')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const usersData = await fs.readFile('./db/user.json', 'utf-8').catch((err) => {
    console.log(chalk.red(err))
    res.status(500).json({ err })
  })
  if (!usersData) return
  res.send(JSON.parse(usersData).users)
})

app.post('/', async (req, res) => {
  let usersData = await fs.readFile('./db/user.json', 'utf-8').catch((err) => {
    console.log(chalk.red(err))
    res.status(500).json({ err })
  })
  if (!usersData) return
  usersData = JSON.parse(usersData)
  usersData.users.push({
    id: usersData.users[usersData.users.length - 1].id + 1,
    ...req.body,
  })
  fs.writeFile('./db/user.json', JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      console.log(err)
    }
  })
  res.send('成功')
})

app.put('/:id', async (req, res) => {
  const id = +req.params.id
  let usersData = await fs.readFile('./db/user.json', 'utf-8').catch((err) => {
    console.log(chalk.red(err))
    res.status(500).json({ err })
  })
  if (!usersData) return
  usersData = JSON.parse(usersData)
  const index = usersData.users.findIndex((item) => item.id === id)
  if (index === -1) {
    res.send('未找到此信息')
    return
  }
  req.body.username ? (usersData.users[index].username = req.body.username) : ''
  req.body.age ? (usersData.users[index].age = req.body.age) : ''
  fs.writeFile('./db/user.json', JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      console.log(err)
    }
  })
  res.send('成功')
})

app.listen('3000', () => {
  console.log(`Web服务器已成功运行在${chalk.magenta('http://127.0.0.1:3000')}`)
})
