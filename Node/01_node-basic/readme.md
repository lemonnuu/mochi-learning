# node-basic

Node.js 是一个可以让 JavaScript 运行在操作系统上的运行环境。

## 安装 node

- 官网安装
- nvm 安装(推荐)

## 命令行运行 node 脚本

命令行运行 node 脚本有两种方式：

1. 显式告诉 shell 使用 node 运行脚本, 即 `node xxx.js`
2. 使用 shebang 在文件第一行写入执行环境, 告诉操作系统使用哪个解释器来运行脚本

shebang 语法由 `#!` 开头, 其后可以有一个或数个空白字符, 为解释器的绝对路径, 用于调用解释器。

```shell
#! /usr/bin/node
```

并非所有操作系统的 bin 文件夹中都有 node, 但都应该有 env。可以告诉操作系统使用 node 为参数运行 env：

```shell
#! /usr/bin/env node
```

需要注意的是, 要使用 shebang, 此文件应该具有可执行权限, Linux 可使用 chmod 修改文件权限：

```shell
chmod u+x xxx.js
```

## process 核心模块

### 环境变量

Node.js 的 `process` 核心模块提供了 `env` 属性, 该属性承载了在启动进程时设置的所有环境变量。

`process` 核心模块不需要被 "require", 它是自动可用的。这是访问 NODE_ENV 环境变量的示例, 该环境变量默认情况下被设置为 `'development'`。

```js
process.env.NODE_ENV
```

在脚本运行之前可将其设置为 `'production'`, 告诉 Node 这是生产环境。可以以相同的方式访问设置任何自定义的环境变量。

### 命令行参数

当使用以下命令调用 Node.js 应用程序时, 可以传入任意数量的参数：

```shell
node xxx.js
```

参数可以是独立的, 也可以具有键和值。例如：`node xxx.js name` 或 `node xxx.js name=abc`

获取命令行参数值的方式还是使用 Node.js 内置的 `process` 核心模块, 它公开了 `argv` 属性, 该属性是一个包含所有命令行调用参数的数组。

- 第一项是 node 命令的完整路径
- 第二项是正被执行的文件完整路径
- 其它所有参数从第三项位置开始

下面是执行 `node xxx.js ---name=abc` 后, 其 `process.argv` 的值：

```js
;['D:\\nvm install\\node install\\node.exe', 'F:\\Mochi\\mochi-learn\\01_node-basic\\test.js', '--name=abc']
```

如需对命令行参数进行解析, 最好的方法是采用第三方库, 如 `minimist` 或 `commander`。

## 你不知道的 console

众所周知, `console.log()` 会打印传入到控制台的字符串, 且可以接收多个参数。

但, 对 console 的了解, 好像也就局限于此了...

Node.js 提供了 console 模块, 它基本上与浏览器中的 console 对象相同, 含有大量非常有用的与命令行交互的方法。

### 为输出抹上亿点点色彩

可以使用[转义序列](https://gist.github.com/iamnewton/8754917)在控制台中为文本的输出着色, 转义序列是一组标识颜色的字符。例如：

```js
console.log('\x1b[30m%s\x1b[0m', '你好...黑')
console.log('\x1b[31m%s\x1b[0m', '你好...红')
console.log('\x1b[32m%s\x1b[0m', '你好...绿')
console.log('\x1b[33m%s\x1b[0m', '你好...黄')
console.log('\x1b[34m%s\x1b[0m', '你好...蓝')
console.log('\x1b[35m%s\x1b[0m', '你好...紫')
console.log('\x1b[36m%s\x1b[0m', '你好...青')
console.log('\x1b[37m%s\x1b[0m', '你好...白')
```

注：可以对着转义序列去玩一下, 只要更改诸如 `[32m%s` 的子串即可。

当然, 这是执行操作的底层方法。为控制台输出着色最简单的方法还是使用库, [chalk](https://github.com/chalk/chalk) 就是一个这样的库。

### 打印错误日志

`console.error` 可打印错误日志, 它会打印到 stderr 流。

### 计算耗时

可以使用 `console.time()` 和 `console.timeEnd()` 轻松的计算中间代码运行所需的时间。

```js
const doSomething = () => console.log('测试')
const measureDoingSomething = () => {
  console.time('doSomething()')
  //做点事，并测量所需的时间。
  doSomething()
  console.timeEnd('doSomething()')
}
measureDoingSomething()
// 测试
// doSomething(): 0.619ms
```

### 元素计数

`console.count()` 不仅打印日志, 还打印日志的执行次数。

```js
const oranges = ['橙子', '橙子']
const apples = ['苹果']
oranges.forEach((fruit) => {
  console.count(fruit)
})
apples.forEach((fruit) => {
  console.count(fruit)
})
// 橙子: 1
// 橙子: 2
// 苹果: 1
```

## 命令行交互问答

如何使 Node.js CLI 程序具有交互性？

从版本 7 开始, Node.js 提供了 [readline](https://nodejs.org/dist/latest-v18.x/docs/api/readline.html) 模块来执行以下操作：

每次一行地从可读流获取输入。(例如 `process.stdin` 流, 在 Node.js 程序执行期间该流就是终端输入)

```js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

readline.question("What's your name?", (name) => {
  console.log(`你好, ${name}`)
  readline.close()
})
// What's your name?Mochi
// Hello, Mochi
```

[inquirer](https://github.com/SBoudrias/Inquirer.js) 库提供了更完整更抽象的解决方案

## Node.js 模块化

Node.js 默认使用 CommonJS 模块化规范, module 对象上最重要的两个属性分别是 `id` 和 `exports`, this 默认指向 `module.exports`。`module.paths` 是 require 寻址路径。

```js
console.log(module)
console.log(this)
console.log(this === module.exports)

/* output:
Module {
  id: '.',
  path: 'F:\\Mochi\\mochi-learn\\01_node-basic',
  exports: {},
  parent: null,
  filename: 'F:\\Mochi\\mochi-learn\\01_node-basic\\004_modular.js',
  loaded: false,
  children: [],
  paths: [
    'F:\\Mochi\\mochi-learn\\01_node-basic\\node_modules',
    'F:\\Mochi\\mochi-learn\\node_modules',
    'F:\\Mochi\\node_modules',
    'F:\\node_modules'
  ]
}
{}
true
*/
```

## npm

npm 是 Node.js 标准的软件包管理器。

当使用 npm 安装软件包时, 可以执行两种安装类型：

- 全局安装
- 本地安装

本地安装的软件包会被安装到当前文件树中的 node_modules 子文件夹下。全局安装的软件包确切位置可使用 `npm root -g` 查看。

### npm 依赖与开发依赖

开发依赖是仅用于开发的软件包, 在生产环境并不需要, 如测试的软件包、webpack、Babel 等。

```shell
npm install cowsay --save
# 等同于
npm install cowsay -S

npm install webpack --save-dev
# 等同于
npm install webpack -D
```

`-S` 是 `--save` 的缩写, `-D` 是 `--save-dev` 的缩写。

可以使用 `@` 语法来安装指定版本的软件包。

```js
npm install cowsay@1.3.0
```

### 如何使用 npm 安装的软件包

软件包分为两种, 一种是普通的库, 另一种是可执行文件, 也就是我们常说的 cli。

这两种软件包在安装时都会安装到本地的 node_modules 文件夹中, 不同的是, 如果是可执行文件还会把执行命令放入 `node_modules/.bin/` 目录下。下面是普通库文件的使用方式：

```js
const _ = require('lodash')
```

那如何执行 `node_modules/.bin/` 的可执行文件呢？有三种方式：

1. 直接终端输入可执行文件地址, 如 `.\node_modules\.bin\cowsay hello world!`
2. 通过 `npx` 执行, 如 `npx npx cowsay hello world!`
3. 在 package.json 文件中配置 scripts 执行, 如 `"scripts": {"test": "cowsay hello world!"}`, `npm test`

## package.json

package.json 文件是项目的清单, 它可以做很多完全互不相关的事情。例如, 它是用于工具的配置中心, 也是 npm 和 yarn 存储所有已安装软件包名称和版本的地方。

### 软件包版本

在 dependencies 或 devDependencies 中通常类似以下的版本号 `^0.13.0`、`~0.13.0` 或 `0.13.0`。它们是什么意思呢？

这些符号使用了 semver(语义版本控制), 指定了软件包能接受的更新。所有的版本都有 3 个数字, 第一个是主版本, 第二个是次版本, 第三个是补丁版本。

- 如果以 `^` 开头, 表示接受『主版本不变更即可』的更新。如 `^0.13.0`, 会更新到主版本为 0 的最新版本, 如 `0.new.new`
- 如果以 `~` 开头, 表示『只接受补丁版本的更新』。如 `~0.13.0`, 会更新到主版本为 0, 次版本为 13 的最新补丁版本, 如 `0.13.new`
- 如果没有任何符号, 表示『只接受确切版本, 不接受更新依赖』。如 `0.13.0` 只会安装 `0.13.0` 版本。
- 如果是 `latest`, 表示更新到最新的依赖

### package-lock.json

在知道了软件包版本控制的方式后, 很容易知道这样是存在缺陷的。

因为 node_modules 通常不会被提交至 git, 从 git 拉下来执行 `npm install` 后安装的依赖可能和开发时的依赖不同, 可能是次版本的更新, 也可能是补丁版本的更新。

如果软件包开发作者严格遵循语义版本控制, 这不会有什么问题。但, 这是不可控的, 如果次版本或补丁版本含有不兼容的更新, 那就会造成项目运行失败！

在 npm5 之后, npm 引入了 package-lock.json 文件, package-lock.josn 文件也会提交至 git。它会固化当前安装的每个软件包版本, 当运行 `npm install` 时, 如果项目含有 package-lock.json 文件, 将安装固化版本, 如果没有则以 package.json 为准安装依赖, 然后生成 package.json 文件。

当运行 `npm update` 时, `package-lock.json` 文件中的依赖版本会被更新。

### 查看 npm 包安装版本

若要查看所有已安装的 npm 软件包及版本, 可以 `npm list --depth=0`, depth 参数表示要展示的层级。

```shell
npm list -g --depth=0
```

若要查看软件包在 npm 仓库上最新的可用版本, 可以运行：

```shell
npm view [package_name] version
```

若要查看软件包在 npm 仓库上所有可用版本, 可以运行：

```shell
npm view [package_name] versions
```

## 搭建 HTTP 服务器

web 服务器就是启动了一个服务, 不停的监听这个端口上进来的 http 请求。

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.statusCode = 200
  res.end('hello')
})

const port = 3000
server.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m', `服务运行在http://localhost:${port}上`)
})
```

创建 HTTP 服务器需要引入 http 模块, 服务器被设置为在指定的 3000 端口进行监听, 当服务器准备就绪时, listen 的回调函数会被调用。

`http.createServer()` 传入的回调函数会在每次接收请求时被执行, 回调函数的参数分别是 `request` 和 `response`

- requset 提供了请求的详细信息。通过它可以访问请求头和请求的数据
- response 用于构造要返回给客户端的数据

注：`http.createServer()` 传入回调函数相当于 `http.on('request', (req, res) => {})`。

request 中最有用的信息包括 method 和 url, get 请求的参数包含在 url 中, 如果是 post 请求需要 `req.on('data', chunk => {})` 监听传输数据, 数据传输可能是多次的, `req.on('end', () => {})` 监听数据传输完成。

> In order to support the full spectrum of possible HTTP applications, the Node.js HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.

需要注意的是 post 请求 body 请求体数据解析方式的不同, formdata 数据使用 querystring 模块的 parse 方法, JSON 字符串使用 JSON 处理。

response 可使用：

1. `res.statusCode` 设置响应状态码, `res.statusMessage` 设置响应状态信息
2. `res.setHeader()` 设置响应头信息
3. `res.write()` 写入响应信息
4. `res.end()` 结束 http 请求, 也可将响应信息直接传入 `res.end()` 中

需要注意的是, 直接向 `res.write()` 或 `res.end()` 传入中文的话, 客户端接收是解析不了的, 也就是会乱码, 原因是没有设置响应数据类型。

```js
res.setHeader('Content-Type', 'text/plain;charset=utf-8')
```

如果响应信息储存在文件中, 需要需要 fs 模块的 readFile 读取文件内容, 再写入 res 中。

### node 发送 HTTP 请求

node.js 发送 http 请求是使用 http 模块的 request 方法, 与创建 HTTP 服务器中 "request" 事件处理函数中的 res 一样, 这里的返回数据也需要监听 "data" 和 "end" 事件。

当然最简单的还是使用 axios 库。

## 路径模块

[path](http://dev.nodejs.cn/learn/the-nodejs-path-module) 模块提供了许多非常实用的函数来处理操作系统文件路径。

- `path.basename()` : 返回路径的最后一部分, 第二个参数可以过滤掉文件的扩展名
- `path.dirname()` : 返回路径的目录部分
- `path.extname()` : 返回路径的扩展名部分
- `path.isAbsolute()` : 如果是绝对路径，则返回 true
- `path.join()` : 连接路径的两个或多个部分
- `path.normalize()` : 当包含类似 `.`、`..` 或双斜杠等相对的说明符时，则尝试计算实际的路径：
- `path.parse()` : 解析对象的路径为组成其的片段, 如：`{root: '/',dir: '/users',base: 'test.txt',ext: '.txt',name: 'test'}`
- `path.relative()` : 接受 2 个路径作为参数。 基于当前工作目录，返回从第一个路径到第二个路径的相对路径
- `path.resolve()` : 获得相对路径的绝对路径计算

`path.sep` 是路径段分隔符, 在 Windows 上是 `\`, 在 Linux/macOs 上是 `/`。`path.delimiter` 是路径定界符, 在 Windows 上是 `;`, 在 Linux/macOs 上是 `:`。

## 文件系统模块

[fs](http://dev.nodejs.cn/learn/the-nodejs-fs-module) 模块提供了许多非常实用的函数来访问文件系统。

注：如果需要对文件/文件夹进行操作, 可以安装 fs-extra 模块, 它是 fs 模块的直接替代品, 并在此之上提供了更多的功能。

- `fs.access()` : 检查文件是否存在，以及 Node.js 是否有权限访问。
- `fs.appendFile()` : 追加数据到文件。如果文件不存在，则创建文件。
- `fs.chmod()` : 更改文件（通过传入的文件名指定）的权限。相关方法：`fs.lchmod()`、`fs.fchmod()`。
- `fs.chown()` : 更改文件（通过传入的文件名指定）的所有者和群组。相关方法：`fs.fchown()`、`fs.lchown()`。
- `fs.close()` : 关闭文件描述符。
- `fs.copyFile()` : 拷贝文件。
- `fs.createReadStream()` : 创建可读的文件流。
- `fs.createWriteStream()` : 创建可写的文件流。
- `fs.link()` : 新建指向文件的硬链接。
- `fs.mkdir()` : 新建文件夹。
- `fs.mkdtemp()` : 创建临时目录。
- `fs.open()` : 设置文件模式。
- `fs.readdir()` : 读取目录的内容。
- `fs.readFile()` : 读取文件的内容。相关方法：`fs.read()`。
- `fs.readlink()` : 读取符号链接的值。
- `fs.realpath()` : 将相对的文件路径指针（.、..）解析为完整的路径。
- `fs.rename()` : 重命名文件或文件夹。
- `fs.rmdir()` : 删除文件夹。
- `fs.stat()` : 返回文件（通过传入的文件名指定）的状态。相关方法：`fs.fstat()`、`fs.lstat()`。
- `fs.symlink()` : 新建文件的符号链接。
- `fs.truncate()` : 将传递的文件名标识的文件截断为指定的长度。相关方法：`fs.ftruncate()`。
- `fs.unlink()` : 删除文件或符号链接。
- `fs.unwatchFile()` : 停止监视文件上的更改。
- `fs.utimes()` : 更改文件（通过传入的文件名指定）的时间戳。相关方法：`fs.futimes()`。
- `fs.watchFile()` : 开始监视文件上的更改。相关方法：`fs.watch()`。
- `fs.writeFile()` : 将数据写入文件。相关方法：`fs.write()`。

fs 所有的方法默认情况下都是异步的，但是在在后面加上 Sync 也可以同步地工作, 如 `fs.readFileSync()`。

可以借助 util 模块中的 promisify 方法对 fs 模块回调函数形式的异步方法转化为 promise 的形式：

```js
const { promisify } = require('util')
const readFilePromisify = promisify(fs.readFile)
```

Node.js 10 以上也有对 fs 模块 promise API 的支持, 如：

```js
const fs = require('fs/promises')
```

### 文件属性

每个文件都带有一组详细信息, 可以使用 fs 模块提供的 `stat()` 方法查看。文件信息中常用的如下：

- stat.isFile() : 是否是文件
- stat.isDirectory() : 是否是目录
- stat.isSymbolicLink() : 是否符号链接
- stat.size : 文件大小(字节为单位)

### 判断文件/文件夹是否存在

可以使用 `fs.existsSync()` 判断文件/文件夹是否存在。

### 读取文件

Node.js 中读取文件最简单的方式是使用 `fs.readFile()` 方法, 向其传入文件路径、编码以及回调函数。

```js
fs.readFile('./fetch.html', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(chalk.yellow(data))
  }
})
```

### 写入/追加写入 文件

Node.js 中写入文件最简单的方式是使用 `fs.writeFile()`, 如果文件不存在会先创建一个文件再写入。：

```js
fs.writeFile('./test.txt', '内容', (err) => {
  if (err) {
    console.log(err)
  }
})
```

如果文件已经存在 `fs.writeFile()` 会替换文件的内容, 如果想要向文件中追加内容, 可以先读取出来再与追加内容拼接重新写入文件。

将内容追加到文件末尾的便捷方法是 `fs.appendFile()`：

```js
fs.appendFile('./test.txt', '追加内容', (err) => {
  if (err) {
    console.log(err)
  }
})
```

写入文件方法都是在将全部内容写入文件之后才会将控制权返回给程序(在异步的版本中，这意味着执行回调)。在这种情况下，更好的选择是使用流写入文件的内容。

### 删除文件

可以使用 `fs.unlink()` 删除文件。

### 创建新的文件夹

可以使用 `fs.mkdir()` 或 `fs.mkdir()` 创建新的文件夹：

```js
if (!fs.existsSync('./dir')) {
  console.log(fs.existsSync('./dir'))
  fs.mkdirSync('./dir')
}
```

### 重命名文件或文件夹

可以使用 `fs.rename` 重命名文件或文件夹：

```js
fs.renameSync('./dir', './newDir', (err) => {
  if (err) {
    console.log(err)
  }
})
```

### 删除文件夹

可以使用 `fs.rmdir()` 删除文件夹。

### 读取目录内容

可以使用 `fs.readdir()` 读取目录的内容, 注意『只是当前目录的文件和文件夹, 不包括孙子文件』, 并返回文件/文件夹的相对路径。

```js
if (fs.existsSync('./dir')) {
  fs.readdir('./dir', (err, relativePath) => {
    if (err) {
      console.log(err)
    } else {
      console.log(relativePath)
    }
  })
}
```

## 如何漂亮的输出对象

```js
console.log(JSON.stringify(obj, null, 2))
```
