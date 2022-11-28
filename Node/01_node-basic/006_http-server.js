const chalk = require('chalk')
const http = require('http')
const fsPromise = require('fs/promises')
const url = require('url')

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true)
  res.statusCode = 200
  res.statusMessage = 'success'
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method.toUpperCase() === 'GET') {
    switch (reqUrl.pathname) {
      case '/':
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        const html = await fsPromise.readFile('./index.html')
        res.write(html)
        break
      case '/image.jpg':
        const img = await fsPromise.readFile('./image.jpg')
        res.write(img)
        break
      default:
        res.statusCode = 404
        res.statusMessage = 'not found'
        break
    }
    res.end()
  } else if (req.method.toUpperCase() === 'POST') {
    switch (reqUrl.pathname) {
      case '/inquirer': {
        const buffers = []
        req.on('data', (chunk) => {
          buffers.push(chunk)
        })
        req.on('end', () => {
          const requestBody = JSON.parse(Buffer.concat(buffers).toString())
          res.end(`来自${requestBody.country}的${requestBody.name}真的帅!`)
        })
        break
      }
      case '/form': {
        const buffers = []
        req.on('data', (chunk) => {
          buffers.push(chunk)
        })
        req.on('end', () => {
          res.setHeader('Content-Type', 'text/plain;charset=utf-8')
          const requestBody = require('querystring').parse(Buffer.concat(buffers).toString())
          console.log(requestBody)
          res.end(`来自${requestBody.country}的${requestBody.name}真的帅!`)
        })
        break
      }
      default:
        break
    }
  } else {
    end()
  }
})

server.listen('3000', () => {
  console.log(`此http服务器正运行在${chalk.magenta('http://127.0.0.1:3000')}`)
})
