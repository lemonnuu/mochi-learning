const chalk = require('chalk')
const fs = require('fs')

// 01. 文件描述符
fs.open('./fetch.html', (err, fd) => {
  if (err) {
    console.log(err)
  } else {
    console.log(chalk.red(fd))
  }
})

// 02. 文件信息
fs.stat('./fetch.html', (err, stats) => {
  if (err) {
    console.log(err)
  } else {
    console.log(chalk.green(stats.isFile()))
    console.log(chalk.green(stats.isDirectory()))
    console.log(chalk.green(stats.isSymbolicLink())) // 是否符号链接
    console.log(chalk.green(stats.size))
  }
})

// 03. 读取文件
fs.readFile('./fetch.html', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(chalk.yellow(data))
  }
})

// 04. 写入文件
// fs.writeFileSync('./test.txt', '内容', (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

// 05. 追加内容
// fs.appendFileSync('./test.txt', '追加内容', (err) => {
//   if (err) {
//     console.log(err)
//   }
// })

// 06. 创建文件夹
// if (!fs.existsSync('./dir')) {
//   fs.mkdirSync('./dir')
// }

// 07. 重命名文件或文件夹
// if (fs.existsSync('./dir')) {
//   const random = Math.floor(Math.random() * 100000)
//   fs.renameSync('./dir', `'./newDir${random}`, (err) => {
//     if (err) {
//       console.log(err)
//     }
//   })
// }

// 08. 读取文件夹
if (fs.existsSync('./dir')) {
  fs.readdir('./dir', (err, relativePath) => {
    if (err) {
      console.log(err)
    } else {
      console.log(chalk.cyan(relativePath))
    }
  })
}
