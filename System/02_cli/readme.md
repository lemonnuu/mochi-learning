# 脚手架开发

一：为什么需要开发脚手架? --> 提升前端研发效能!

1. 创建项目 + 通用模板
   - 埋点
   - HTTP 请求
   - 工具方法
   - 组件库
2. git 操作
   - 创建仓库
   - 代码冲突
   - 远程代码同步
   - 创建版本
   - 发布打 tag
3. 构建 + 发布上线
   - 依赖安装和构建
   - 资源上传 CDN
   - 域名绑定
   - 测试/正式服务

二：脚手架核心价值

- 自动化：项目重复代码拷贝、git 操作、发布上线操作
- 标准化：项目创建、git flow、发布流程、回滚流程
- 数据化：研发过程系统化、数据化, 使得研发过程可量化

三：和自动化构建工具区别?

Jenkins、Travis 等自动化构建工具已经比较成熟了, 为什么还需要自研脚手架?

- 不满足需求：Jenkins、Travis 通常在 git hooks 中触发, 需要在服务端执行, 无法覆盖研发人员本地的功能。如创建项目自动化、本地 git 操作自动化等。
- 定制复杂：Jenkins、Travis 定制过程需要开发插件, 其过程较为复杂, 需要使用 Java 语言, 对前端同学不够友好

## 从使用角度理解什么是脚手架?

脚手架本质上是一个操作系统的客户端, 只不过它是通过命令行执行的。如：

```shell
vue create app
```

上面的命令由 3 个部分组成：

1. 主命令 -> `vue`
2. command -> `create`
3. command 的 param : `app`

上面是一个最为简单的脚手架命令, 但实际场景往往复杂多变。比如, 如果当前目录已经有文件了, 我们需要覆盖当前目录下的文件而强行进行安装, 可以输入：

```shell
vue create app --force
```

这里的 `--force` 叫做 option, 用来辅助脚手架确认在特定场景下用户的选择(可以理解为配置)。

再比如另外一种场景, 如果我们希望创建项目的同时, 还会自动执行 `npm install` 帮助用户安装依赖, 且指定淘宝源安装, 可以输入：

```shell
vue create app --force -r https://registry.npm.taobao.org
```

这里的 `-r` 也叫做 option, 它与 `--force` 不同。`-` 是采用简写, 其后只能接一个字母。`--` 是全拼, 其后一般是一个单词。比如, `-r` 就是 `--registry` 的缩写。

那对于脚手架的使用者来说, 人家怎么知道你有哪些 option(选项), 又分别代表什么意思。

所以一个 nice 的脚手架通常需要暴露 `--help` 选项, 用于对用户展示所有的 options 及其含义：

```shell
vue create --help
```

需要补充一点, `-r https://registry.npm.taobao.org` 后面的 `https://registry.npm.taobao.org` 是 option 的 param。其实, `--force` 可以理解为 `--force true`, 简写为 `--force` 或 `-f`。

## 脚手架执行原理

在终端输入一条指令时, 比如 `xxx`：

```shell
xxx
```

终端会顺着环境变量中寻找看有没有对应的可执行程序, 如果没有, 则会抛错：

> xxx : 无法将“xxx”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。

我们可以通过 `which vue` 找到 vue 指令的路径。(windows 的 cmd 是 `where vue`, powerShell 是 `where.exe vue`)

```shell
where.exe vue
```

> D:\nvm install\node install\vue D:\nvm install\node install\vue.cmd

```shell
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "$basedir/node_modules/@vue/cli/bin/vue.js" "$@"
else
  exec node  "$basedir/node_modules/@vue/cli/bin/vue.js" "$@"
fi
```

上面是路径下的 vue 文件内容, 当终端顺着环境变量能找着它的时候就会执行它。文件第一行的 `#!/bin/sh` 采用了 shebang 语法, 又会去找环境变量中的 shell 执行这个文件。接下来就会执行到了 `/node_modules/@vue/cli/bin/vue.js` 这里, 又会 node_modules 里边儿找。

打开这个 JS 文件你会发现, 它的第一行也采用了 shebang 语法：`#!/usr/bin/env node`。

所以脚手架本质上是用环境变量中的 node 执行了找到的 JS 文件。

还需要补充一点, 如在 `vue create --help` 中, vue 后面跟的都是路径参数。

那为什么全局安装 `@vue/cli` 后会添加 `vue` 命令呢?

在 npm 下载完 `@vue/cli` 后, 会去其 package.json 中查看有没有 bin 选项, 如果有则会暴露出来。

## 脚手架本地 link 标准流程

链接本地脚手架：

```shell
cd your-cli-dir
npm link
```

链接本地库文件：

```shell
cd your-lib-dir
npm link
```

本地脚手架链接本地库文件(本地库文件链接本地库文件也是同理)：

```shell
cd your-cli-dir
npm link your-lib
```

取消链接本地库文件：

```shell
cd your-lib-dir
npm unlink
cd your-cli-dir
npm unlink your-lib
# 或者
npm uninstall your-lib -g
```

### npm link

`npm link` 可将当前项目链接到 node 全局的 node_modules 中作为一个库文件, 如果 package.josn 含有 bin 配置还会创建可执行文件。

`npm link your-lib` 可将指定的全局库文件链接到当前项目的 node_modules 作为库文件。

### npm unlink

`npm unlink` 可将当前项目从 node 全局的 node_modules 中移除。

`npm unlink your-lib` 可将指定的全局库文件从当前项目的 node_modules 中移除。

## 脚手架原生开发痛点

1. 重复操作
   - 多 package 本地 link
   - 多 package 依赖安装
   - 多 package 单元测试
   - 多 package 代码提交
   - 多 package 代码发布
2. 版本一致性
   - 发布时版本一致性
   - 发布后互相依赖版本升级

package 越多, 管理复杂度越高。
