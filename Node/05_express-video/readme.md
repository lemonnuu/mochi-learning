# video 项目

## video 项目逻辑架构

```diff
video/
├── 用户频道系统/
│   ├── 用户注册
│   ├── 登录
│   ├── 用户身份认证
│   └── 频道/
│       ├── 管理频道
│       └── 设置频道
├── 视频系统/
│   ├── 视频上传/
│   │   ├── 阿里云 VOD
│   │   ├── RAM 身份
│   │   ├── 视频上传凭证
│   │   ├── 视频入库
│   │   └── 更新视频
│   ├── 视频管理/
│   │   ├── 视频详情
│   │   ├── 视频列表
│   │   ├── 删除视频
│   │   └── 播放记录
│   └── 热门推荐机制/
│       └── 点赞收藏转发
└── 交互系统
```

## 基础中间件

1. [express.json()](https://expressjs.com/en/4x/api.html#express.json)、[express.unlencoded()](https://expressjs.com/en/4x/api.html#express.urlencoded) 处理 request 不同类型的 body 数据
2. [cors](https://github.com/expressjs/cors) 处理跨域中间件
3. [morgan](https://github.com/expressjs/morgan) 请求日志记录中间件

## 开发之前

开发之前有几点需要说明一下：

### 接口前缀

由于是开发数据接口服务, 并且考虑到接口版本的更新迭代, 所有业务型接口统一加上前缀 `/api/v1`。

### RESTful API

接口全部遵循 [RESTful API](https://restfulapi.cn/) 接口设计规范。

## 用户频道系统

### 用户注册

首当其冲的肯定是用户注册功能开发, 定义 POST 接口 `/register`, 需要接收的请求数据包含：

- username : 用户名
- password : 密码
- email : 邮箱
- phone : 手机号
- avatar(可选) : 头像

在将信息存入数据库还需包含：

- createAt : 创建时间
- updateAt : 更新时间

考虑到这俩字段的通用性, 可将其拆分为单独模块进行复用。

#### md5 摘要算法

总所周知, 密码的存储不能使用明文, 得经过一些处理再入库, 这里采用 md5 摘要算法进行处理。

md5 是哈希摘要算法, 可用于加密处理, 但不是加密算法！

md5 是哈希摘要算法, 可用于加密处理, 但不是加密算法！

md5 是哈希摘要算法, 可用于加密处理, 但不是加密算法！

重要的事情说三遍！

md5 是哈希摘要算法, 不是加密算法。加密算法包括对称加密与非对称加密算法, 不管哪种加密算法, 都可以进行解密。而摘要算法是一个单向函数, 计算容易, 反推不行, md5 就是其中一种哈希摘要算法。

虽然 md5 一经计算反推不了, 但是同一个字符串经过 md5 计算后, 得到的结果值却永远相同。这也意味着单纯的 md5 显得并不是特别安全, 可以暴力破解。

那为什么还可以使用 md5 摘要算法来处理密码呢？

很简单, 我们可以对密码进行一系列"折腾"后, 再丢给 md5 计算一次甚至多次。这样一来, 即使破解了反推后的字符串, 不知道处理过程, 还是得不到最终的密码。但是, 仍需保证用户输入的密码具有一定的复杂性。

#### crypto

Node.js 内置了 [crypto](https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html) 模块, 可用于各种加密处理。这里我们采用 md5 哈希算法。下面是一个示例：

```js
const crypto = require('crypto')
const result = crypto.createHash('md5').update('123').digest('hex')
```

crypto 内置了很多方法, 这里采用 md5 的哈希算法 `crypto.createHash('md5')`, `update()` 传入要加密的字符串, `digest()` 是采用哪种方式 md5, 可选值有 `base64`, `base64url`, `binary`, `hex`。

#### 数据验证

大家都知道, 在接收到客户端的数据后还需验证其合法性, 合法才能存入数据库, 否则抛错给客户端。

验证数据可用 express 第三方中间件 [express-validator](https://express-validator.github.io/docs/)。

```shell
npm install express-validator
```

express-validator 的使用可分为两部分, body 用于添加校验, validationResult 用于检验校验结果。

```js
const { body, validationResult } = require('express-validator')
```

可定义一个 validate 函数, 参数为一个数组, 每一项是一个 body 校验, 返回一个中间件, 然后校验不通过则将错误信息抛给客户端, 否则将状态传递给下一个中间件。

```js
module.exports = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)))
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    res.status(400).json({ errors: errors.array() })
  }
}
```

express-validator 会把所有的验证结果放入 req 里, 所以 `validationResult(req)` 能够获取错误信息。

```js
router.post('/register', validate([...body...]), usersControl.register)
```

注：`[...body...]` 表示校验的每一项。如：

```js
;[
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .bail()
    .isLength({ min: 2, max: 12 })
    .withMessage('用户名长度不能小于 2 位且不能超过 12 位')
    .bail()
    .matches(/^\w$/)
    .withMessage('用户名只能由数字、字母、下划线组成'),
]
```

`.custom(callback)` 可以自定义校验规则, 回调函数的参数是当前校验字段的值, 如：

```js
body('email').custom(async (val) => {
  const emailValidate = await User.findOne({ email: val })
  if (emailValidate) {
    return Promise.reject('邮箱已被注册')
  }
})
```

### 用户登录

由于 HTTP 协议是无状态的, 用户登录成功后, 就需要返回客户端一个 token, 表示身份信息。 随后客户端调用的除注册、登录以外的接口, 都需要进行身份认证。JSON Web Token(缩写 JWT) 是目前最流行的跨域认证解决方案。

#### JWT

##### 跨域认证问题

互联网服务离不开用户认证, 一般流程是下面这样的：

1. 用户向服务器发送用户名和密码进行登录
2. 服务器验证通过后, 在当前对话(session)里面保存相关数据, 比如用户角色、登录时间等等
3. 服务器向用户返回一个 session_id, 写入用户的 Cookie
4. 用户随后的每一次请求, 都会通过 Cookie, 将 session_id 传回服务器
5. 服务器收到 session_id, 找到前期保存的数据, 由此得知用户的身份

session 是保存在服务器端(放哪不管)中的, cookie 是客户端每次发送 HTTP 请求都会携带的信息, 但是 cookie 不支持跨域。

这种模式的问题在于, 扩展性不好。单机当然没有问题, 但如果是服务器集群, 或者是跨域的服务导向架构, 就要求 session 数据共享, 使得每台服务器都能读取 session。

举例来说, A 网站和 B 网站是同一家公司的关联服务。现在要求, 用户只要在其中一个网站登录, 再访问另一个网站就会自动登录, 请问如何实现？

一种解决方案就是 session 数据持久化, 写入数据库或别的持久层。各种服务收到请求后, 都向持久层请求数据。这种方案的优点是架构清晰, 缺点是工程量比较大, 另外, 万一持久层挂了, 就 GG 了。

另一种方案是, 索性我就不在服务器保存 session 数据了, 所有数据都保存在客户端, 你每次请求都给我发回至服务器。JWT 就是这种方案的一个代表。

##### JWT 原理

JWT 的原理是, 服务器认证以后, 生成一个 JSON 对象, 发回给用户, 就像下面这样：

```json
{
  "username": "mochi",
  "role": "admin",
  "expiresIn": "3600"
}
```

以后, 用户在服务端通信的时候, 都需要返回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据, 服务器在生成这个对象的时候, 还会加上签名。

服务器就不保存任何 session 数据了, 也就是说, 服务器变成无状态了, 从而比较容易实现扩展。

##### JWT 的数据结构

实际的 JWT 大概像下面这样：

![JWT 数据结构](https://restfulapi.cn/assets/index/images/f6c6c1ccab28c589d07a9bb60a079ee8.jpg)

它是一个很长的字符串, 中间用 `.` 分隔成三个部分。注意, JWT 内部是没有换行的, 这里只是为了便于展示, 将它写成了几行。

JWT 的三个部分依次如下：

```
Header (头部)
Payload (负载)
Signature (签名)
```

写成一行, 就是下面的样子：

Header.Payload.Signature

![JWT Token](https://restfulapi.cn/assets/index/images/6db843bf335555168fd69f5d58592356.jpg)

Header 部分是一个 JSON 对象, 描述 JWT 的元数据, 通常是下面的样子：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

上面代码中, alg 属性表示签名的算法, 默认是 HMAC SHA256(写成 HS256), typ 属性是表示这个令牌(token)的类型, JWT 令牌统一写成 JWT。

最后, 将上面的 JSON 对象使用 Base64URL 算法转成字符串。

Payload 部分也是一个 JSON 对象, 用来存放实际需要传递的数据。JWT 规定了 7 个官方字段, 供选用：

```
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```

除了官方字段, 还可以在这个部分定义私有变量字段, 可用于存储用户信息：

```json
{
  "username": "mochi",
  "role": "admin"
}
```

注意, JWT 默认是不加密的, 任何人都可以读到, 所以不要把秘密信息放在这个部分。这个 JSON 对象也要使用 Base64URL 算法转成字符串。

Signature 部分是对前俩部分的签名, 防止数据篡改。

首先, 需要指定一个密钥(secret), 通常采用 uuid 保证唯一性。这个密钥只有服务器才知道, 不能泄露给用户。然后, 使用 Header 里面指定的签名算法(默认是 HMAC SHA256), 按照下面的公式生成签名。

```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

算出签名后, 把 Header、Payload、Signature 三个部分拼成一个字符串, 每个部分之间用 `.` 分隔, 就可以返回给用户。

##### Base64URL

前面提到，Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。

JWT 作为一个令牌(toekn), 有些场合可能会放到 URL(比如 api.example.com/?token=xxx)。Base64 有三个字符+、/和=, 在 URL 里面有特殊含义, 所以要被替换掉：=被省略、+替换成-，/替换成\_ 。这就是 Base64URL 算法。

##### JWT 使用方式

客户端收到服务器返回的 JWT 后, 可以存储在 Cookie 中, 也可以存储在 localStorage 中, 通常是 localStorage。

此后, 客户端每次与服务器通信, 都要带上这个 JWT。可以把它放在 cookie 里面自动发送, 但是这样不能跨域, 所以更好的做法是放在 HTTP 请求头信息 Authorization 字段里面, 且加上前缀 `Bearer `：

```
Authorization: Bearer
```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

##### JWT 的特点

1. JWT 默认是不加密, 但也是可以加密的。生成原始 Token 以后, 可以用密钥再加密一次
2. JWT 不加密的情况下, 不能将秘密数据写入 JWT
3. JWT 不仅可以用于认证, 也可以用于交换信息。有效使用 JWT, 可以降低服务器查询数据库的次数
4. JWT 的最大缺点是, 由于服务器不保存 session 状态, 因此无法在使用过程中废止某个 token, 或者更改 token 的权限。也就是说, 一旦 JWT 签发了, 在到期之前就会始终有效, 除非服务器部署额外的逻辑
5. JWT 本身包含了认证信息, 一旦泄露, 任何人都可以获得该令牌的所有权限。为了减少盗用, JWT 的有效期应该设置得比较短。『对于一些比较重要的权限, 使用时应该再次对用户进行认证』
6. 为了减少盗用, JWT 不应该使用 HTTP 协议明码传输, 要使用 HTTPS 协议传输

#### Node 实现 JWT

Node 中实现 JWT 需使用 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 库：

```shell
npm install jsonwebtoken
```

不管是生成 token 还是 解析 token 都是异步的。

##### 生成 token

生成 token 使用 `jwt.sign(payload, secret, callback)` 方法, 可使用 utils.promisify 对其 promise 化。

```js
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sign = promisify(jwt.sign)
const jwtSecret = '06583af2-03ff-47fa-aa43-5f54e2d7b04a'
const createToken = async (userInfo) => {
  return await sign({ userInfo }, jwtSecret, { expiresIn: 60 * 60 })
}
```

##### 解析 token

解析 token 使用 `jwt.verify(token, secret, callback)` 方法, 可使用 utils.promisify 对其 promise 化。通常是封装成中间件的方式。

```js
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const verify = promisify(jwt.verify)
const jwtSecret = '06583af2-03ff-47fa-aa43-5f54e2d7b04a'
const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization
  token = token ? token.split('Bearer ')[1] : null
  if (!token) return res.status(402).json({ error: '请传入 token' })
  try {
    req.userInfo = (await verify(token, jwtSecret)).userInfo
    next()
  } catch (error) {
    return res.status(402).json({ error: '无效的 token' })
  }
}
```

### 视频系统 & 交互系统

视频系统与交互系统由于要买阿里云的服务就不搞了, 残缺啊...

### Redis

> The open source, in-memory data store used by millions of developers as a database, cache, streaming engine, and message broker.

redis 是可用作数据库、缓存、流引擎和消息代理的开源『内存』数据存储。由于是基于内存的, 效率会非常高。

### Nginx

Ngnix 是一款自由的、开源的、高性能的 HTTP 服务器和反向代理服务器。
