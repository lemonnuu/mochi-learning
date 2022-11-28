# a simple cli

## 需求分析

1. 创建全局自定义指令
2. 命令行参数接收处理
3. 下载远程项目代码
4. 项目初始化完成提示

## 创建全局自定义指令

1. 创建新项目, 并创建 bin 目录, 里面放置一个 JS 文件作为 cli 执行入口文件
2. `npm init -y` 初始化项目, 可适当更改 package.json 文件配置, 其中最为关键的是 `bin` 属性
3. bin 目录下的 cli 入口执行文件采用 shebang 语法, 开头第一行加入 `#! /usr/bin/env node`, 表示去找操作系统环境变量中的 node 执行此文件
4. `npm link` 将指令挂载至 env, 创建全局自定义指令成功

文件目录：

```diff
+ 02_my-cli/
+ ├── bin/
+ │   └── mycli.js
+ └── package.json
```

mycli.js：

```diff
+ #! /usr/bin/env node

+ console.log('Mochi')
```

## 命令行参数接收处理

`process.argv` 从第三个参数开始可接收指令传递的参数, 但是自己解析太过复杂和不靠谱, 采取 [commander](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md) 库对命令行参数进行处理。

### commander

commander 负责将参数解析为『选项』和『命令参数』

```shell
npm install commander
```

安装完 commander 后, 第一步是声明 program 变量。为简化使用, commander 提供了一个全局对象。

```js
const { program } = require('commander')
```

如果程序比较复杂, 用户需要以多种方式来使用 commander, 如单元测试等, 可以创建本地 commander 对象：

```js
const { Command } = require('commander')
const program = new Command()
```

#### program.parse()

`program.parse` 的第一个参数是要解析的字符串数组, 如果省略, 则默认为 `process.argv`。

```js
program.parse(process.argv)
```

- node: `argv[0]` 是应用, `argv[1]` 是要跑的脚本, 后续为用户参数
- electron: `argv[1]` 根据 electron 应用是否打包而变化

需要注意的是, 解析需要放在最后面。

#### 选项

commander 使用 `.option()` 方法来定义选项, 同时可附加选项的简介。每个选项可以定义一个短选项名称(-后接单个字符)和一个长选项名称(--后接一个或多个单词), 使用逗号、空格或 `|` 分隔。

commander 会默认加入 `-h`、`--help` 选项, 选项被声明后其实是没有任何功能的, 还是得自己实现逻辑, 这只是使用 help 选项时可帮助用户快速上手而已。

<!-- tip: 可以在终端输入 `cli -h` 试试水, 可以想象一下 npm list -g --depth=0 -->

选项分为两种, 一种是 boolean 型选项, 也就是不带参数的选项, 另外一种是带参数的选项(使用尖括号声明在该选项的后, 如 `--expect <value>`)。

```js
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')
```

#### 命令

通过 `.command()` 或 `.addCommand()` 可配置命令。

`.command()` 的第一个参数为命令名称, 命令参数可以跟在名称后边儿, 也可以用 `.argument()` 单独指定。参数可为必选的(<>尖括号表示), 可选的([]方括号表示)或变长参数(点号表示, 如果使用, 只能是最后一个参数)

```js
program
  .command('create <project> [other...]')
  .alias('crt')
  .description('create a project by cli')
  .action((project, args) => {
    console.log(project, args)
  })
```

`.alias()` 可设置命令的别名, `.description()` 则是设置命令的描述(--help 时可见)。

## 命令行交互问答

要实现命令行交互问答可用 node 原生的 readline 模块, 但更好的方式是使用 [inquirer](https://github.com/SBoudrias/Inquirer.js) 库(inquirer 在 9 版本及以上采用 ES Module)。

`inquirer.prompt(questions).then((answers) => {})` 可迅速的开启一个会话, 参数为会话的问题, 是一个数组, 返回一个 Promise 实例, 结果值为 answers, 是一个对象。

### questions

questions 是一个数组, 每个 question 是一个对象, 包含以下选项：

- name : 答案存储的名称, 可以包含 `.`, 表示存储路径
- type: 问题类型, 可以为 `input`, `number`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password` 和 `editor`
- message : 问题描述
- default : 答案的默认值
- choices : 答案选项, 可以为数组或返回数组的函数

```js
inquirer
  .prompt([
    {
      name: 'framwork',
      type: 'list',
      choices: ['express', 'koa', 'egg'],
      message: '请选择项目框架',
    },
  ])
  .then((answers) => {
    console.log(answers)
  })
```

## 下载远程项目代码

下载远程项目代码可使用 [download-git-repo](https://www.npmjs.com/package/download-git-repo) 库。

如果是 Github 可简写为 『所有者/仓库名』, Gitlab 与 Bitbucket 必须加上前缀 『平台:所有者/仓库名』

- GitHub - `github:owner/name` or simply `owner/name`
- GitLab - `gitlab:owner/name`
- Bitbucket - `bitbucket:owner/name`

如果不是以上三个平台, 可直接采用 `direct:url` 的方式下载

### download

`download(url, targetDir, otherOptions, callback)` 方法可以接收四个参数：

- 存储库参数默认为 master 分支, 但可以将分支标记为 URL 片段, 如 `owner/name#branch`
- 第二个参数为下载路径
- 第三个参数为可选对象参数, 如可指定是否以克隆的方式下载 `{clone: true}`, 如果 url 后缀不是 `.zip` 就需要加上此参数, 以克隆的方式下载
- 第四个参数为下载完成的回调函数, 其参数为 error

```js
download(`direct:${repoUrl}`, './test', { clone: true }, (err) => {
  console.log(err ? 'error' : 'success')
})
```

## ora

ora 是命令行任务等待工具, 优雅的终端微调器。

```shell
npm install ora
```

注意下载的版本, 后面也都升级为了 ES Module, 这里采用 CommonJS 记录。

```js
const ora = require('ora')

const spinner = ora('Loading unicorns').start()
```

如果 `ora()` 提供了字符串参数, 会被当作 `spinner.text()`, 表示显示的文本。

- `spinner.start()` 表示开启
- `spinner.close()` 表示关闭
- `spinner.succeed()` 关闭并提示成功信息
- `spinner.fail()` 关闭并提示失败信息
- `spinner.color` 可以更换转圈圈颜色
- `spinner.spinner` 可以更换转圈圈图标
