const http = require('http')

const postData = JSON.stringify({ name: 'Mochi', country: '中国' })

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/inquirer',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

const req = http.request(options, (res) => {
  console.log('状态码', res.statusCode)
  const buffers = []
  res.on('data', (chunk) => {
    buffers.push(chunk)
  })
  res.on('end', () => {
    console.log(Buffer.concat(buffers).toString())
  })
})

req.write(postData)
req.on('error', (err) => {
  console.log(err)
})
req.end()
