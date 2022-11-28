const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

readline.question("What's your name?", (name) => {
  console.log(`Hello, ${name}`)
  readline.close()
})

// readline 模块, 命令行交互问答, 可使用 inquirer 库
