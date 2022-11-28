# express

> Express 是高度包容、快速而极简的 Node.js Web 框架。

Express 是一个路由和中间件 Web 框架, 其自身只具有最低程度的功能：Express 应用程序基本上是一系列中间件函数调用。

## 自我理解

Express 就相当于对原生的 http 模块搭建 web 服务器做了一层封装：

- 不再需要手动调用 `http.createServer`
- 不再需要监听 `req.on('request')` 事件
- 不再需要自己去解析 url, 增加了路由的概念
- 拿 post 请求的数据不需要去监听 `req.on('data')、req.on('end')`, 都给我们处理好了
- 增加了中间件的概念, 洋葱模型, 可以对 req, res 进行一层一层的处理
- 发送响应由原来的 `res.end()` 变为了 `res.send()`

## 中间件

可以将 Express 响应请求的过程为一条流水线, 中间件就是途径的每一道工序, 路由中间件表示分叉, 当请求被响应后(`send()`), 后续的中间件将不再处理, 可以理解为"该产品处理好了, 不需要再加工了, 也就是脱离了流水线"。

中间件函数是可以访问请求对象(req)、响应对象(res)以及下一个中间件的函数。下一个中间件函数通常由名为 next 的变量表示。

中间件函数可以执行以下任务：

- 执行任何代码
- 更改请求和响应对象
- 结束请求
- 调用堆栈中的下一个中间件函数
- 如果当前中间件函数没有结束请求-响应循环, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

Express 应用程序可以使用以下类型的中间件：

- 应用层中间件
- 路由器级中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

路由器级中间件其实可以理解为应用层中间件的子集的扩充, 专门处理路由的, 否则什么都交给应用层处理第一太过臃肿, 第二语义化不好。

Express 内置了以下中间件功能：

- express.static 提供静态资源, 如 HTML 文件、图像等
- express.json 解析带有 JSON 负载的传入请求
- express.urlencoded 解析带有 URL 编码负载的传入请求

### 应用层中间件

应用层中间件通过 `app.use()` 使用, 下面是最基础的应用层中间件：

```js
app.use((req, res, next) => {
  console.log(chalk.red('我是应用层中间件'))
  next()
})
```

传入的回调函数一共接收三个参数, 分别是 `request`, `response` 和如果请求被挂起, 是否将控制权传递给下一中间件函数 `next`。

应用层中间件也可以限定请求方法和匹配路由规则, 且可以一次性添加多个中间件：

```js
app.get(
  '/',
  (req, res, next) => {
    console.log(chalk.yellow('处理根路径的应用层中间件1'))
    next()
  },
  (req, res, next) => {
    console.log(chalk.yellow('处理根路径的应用层中间件2'))
    res.send('/')
  }
)
```

### 路由器级中间件

Express 除了可以创建应用实例外, 还可以创建路由实例。使用路由实例对象的好处是可以将路由匹配规则拆分至不同模块。

```js
const router = express.Router()
```

路由中间件和应用中间件的使用非常类似：

```js
router.get(
  '/',
  (req, res, next) => {
    console.log(chalk.green('处理根路径的路由中间件1'))
    next()
  },
  (req, res, next) => {
    console.log(chalk.green('处理根路径的路由中间件2'))
    res.send('/')
  }
)
```

需要注意的是, 路由实例对象需要被挂载至应用实例才能真正有效：

```js
app.use(router)
```

在挂载的时候, 还可以添加路由前缀：

```js
app.use('/user', router)
```

添加前缀后实际的路由匹配规则都必须加上前缀。

### 404

如果路由匹配规则全部没有命中, 也就是 404 的情况下, 可以使用后置中间件进行处理。

```js
// 注意放后面
app.use((req, res) => {
  res.status(404).send('404 Not Found')
})
```

### 错误处理中间件

当我们的代码发生错误时, 我们通常希望能够捕获到这个错误, 且发送状态码 500 给客户端, 这时可以使用错误处理中间件。

错误处理中间件比普通的中间件多了一个 err 参数, 且放置第一位。注意, 错误处理中间件得放在最后面, 否则捕获不到错误, 流水线！

```js
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Service Error')
})
```

### 响应请求的方法

- `res.send()` 或 `res.end()` : 普通的响应方法
- `res.json()` : 以 JSON 的格式返回数据, 可以把安全的 JSON 对象数组直接传入进去
- `res.download()` : 以下载的方式响应资源, 客户端接收到的是一个下载指令
- `res.redirect()` : 数据接口服务一般用不到, 如果是传统的 MVC 架构模式可能用到
- `res.render()` : 渲染静态模板
- `res.sendStatus()` : 把数据和响应状态码一并返回

## 路由

有关路由需要补充两点：

1. 路由匹配规则可以类似正则表达式的语法, 如`router.get('/us?er', func)`、`app.all('/us+er', func)`
2. 路由可携带路径参数, 如 `app.get('/user/:id', func)`。注意, 路径参数不是 query, 也就是 url `?` 后面部分, 注意区分

## 第三方中间件

### body-parser 中间件

服务器是不知道客户端 post 请求发送的数据是什么格式的, 所以需要借助 req 中 headers 的 Content-Type 来判断并处理, 但是这可以使用中间件来处理。

此模块提供以下解析器：

- JSON body parser
- Raw body parser
- Text body parser
- URL-encoded from body parser
