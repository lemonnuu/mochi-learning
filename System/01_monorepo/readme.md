# monorepo

monorepo 是一个放了许多不同应用或包的代码仓库。与之对应的是 multirepo, 每个应用或包都是一个独立的代码仓库。

## multirepo 的痛点

multirepo 最大的问题在于应用程序之间『共享代码』的过程非常繁琐复杂。对于小型项目采用 multirepo 的代码管理方式是完全没问题的。

假设我们拥有三个独立的存储库 —— app、docs 和 shared-utils。app 和 docs 都依赖于 shared-utils, 它作为一个包发布在 npm 上。

先且说开发过程, 如果不依赖线上版本的 shared-utils, 需要将此包 `npm link` 到全局, app 和 docs 还需要 `npm link shared-utils`, 开发完成后还要对 3 个包分别进行单元测试、代码提交与代码发布, 非常复杂繁琐。

再说比如 shared-utils 出现严重 bug 导致 app 和 docs 运行失常时, multirepo 的管理方式就会变成磨人的小妖精：

1. 修复 shared-utils 错误
2. 将 shared-utils 发布至 npm
3. 提高 app 依赖 shared-utils 的版本号
4. 提高 docs 依赖 shared-utils 的版本号
5. 部署 app 和 docs

应用程序拥有更多诸如 shared-utils 这样的包, 这个过程耗费的时间就越长, 越烦人。

## monorepo 怎么运作

monorepo 是构建在 workspace 基础之上的, 构建的每个应用程序和包都位于自己的工作区中, 并带有自己的 package.json。workspace 可以相互依赖, 也就是说不需要版本控制, 不依赖 npm 中的版本而直接依赖代码库中的版本。

> 现在 npm、yarn、pnpm 都实现了 workspace, 在这之前是采用 Lerna 进行管理。

划分 workspace 后, 一个萝卜一个坑, 我们还有一个主工作区, 也就是根路径目录, 这里是不写业务代码的, 它是用来干大事的：

1. 指定整个 monorepo 中存在的依赖, 如 `turbo`、`prettier` 和对子工作区的依赖
2. 添加 -> 在整个 monorepo 上运行的任务, 而不仅仅针对单一工作区
3. 添加有关如何使用 monorepo 代码库的 readme 文档

回到 multirepo 中的那个问题, 在 monorepo 中只需要：

1. 修复 shared-utils 错误
2. 将 shared-utils 发布至 npm
3. 部署 app 和 docs

更为重要的是, 在主工作区运行的命令可同时操作所有子工作区, 如 test(测试) 和 deploy(部署), 但需配合工具使用, 如 turborepo。

## monorepo 安装/添加/删除/升级包

前面说了, monorepo 代码管理方式多了一个 worksapce 的概念, 那么对于包的操作也是分区的。

### 安装包

在根目录(主工作区)执行：

```shell
pnpm install
```

你会看到 node_modules 文件夹出现在了主工作区和每个子工作区中, 也就是有 package.json 文件的见者有份。

### 主工作区添加/删除/升级包

如果想在主工作区添加包, 需要加一个 `-w` 或 `--workspace-root` 来告诉包管理工具你确定在根目录中添加依赖：

```shell
pnpm add <package> -w
```

但如果只是删除/升级包, 则不需要：

```shell
pnpm uninstall <package>
pnpm update <package>
```

### 子工作区添加/删除/升级包

如果想为子工作区添加/删除/升级包, 则需要指明工作区：

```shell
pnpm add <package> --filter <workspace>
pnpm uninstall <package> --filter <workspace>
pnpm update <package> --filter <workspace>
```

```shell
npm install <package> --workspace=<workspace>
npm uninstall <package> --workspace=<workspace>
npm update <package> --workspace=<workspace>
```

`--workspace` 可简写为 `-w`。

## workspace

添加到 monorepo 的每个应用程序和包都将位于其自己的工作区内, 工作区由包管理器管理, 首先得保证正确配置。

### 配置工作区

要使用 workspace, 必须首先向包管理器声明它们的文件系统位置。推荐是拥有顶级 `app/` 和 `packages` 目录：

- app 文件夹包含应用程序的工作区
- packages 文件夹包含依赖工作区, 如依赖的 utils、组件、eslint 配置等等

npm、yarn 与 pnpm 声明工作区的方式不同, npm 与 yarn 需要在 package.json 文件中定义 workspace 配置项：

```json
{
  "name": "monorepo",
  "version": "1.0.0",
  "workspaces": ["docs", "apps/*", "packages/*"]
}
```

而 pnpm 必须在根目录添加 pnpm-workspace.yaml 文件：

```yaml
packages:
  - 'docs'
  - 'apps/*'
  - 'packages/*'
```

文件目录结构：

```
monorepo\
├─ docs
├─ apps\
│  ├─ api
│  └─ mobile
├─ packages\
│  ├─ tsconfig
│  └─ shared-utils
└─ sdk
```

在上面的示例中, monorepo/docs 本身是一个子工作区, monorepo/apps 和 monorepo/packages 里所有的目录是子工作区, monorepo/sdk 不是工作区。

### 命名工作区

每个工作区都有一个唯一的名称, 是其 package.json 文件中的 `name` 字段：

```json
{
  "name": "shared-utils"
}
```

工作区的名字用于：

1. 指定依赖安装到哪个工作区, 如 `pnpm install <package> --filter <workspaceName>`
2. 在其它工作区使用此工作区, 如 `workspaceName: workspace*`
3. 发布 npm 所使用的名字

可以使用 npm 组织来避免和 npm 现有包发生冲突, 例如可使用 `@myorganization/shared-utils`。

### 相互依赖的工作区

要在一个工作区内使用另一个工作区, 需要使用其名称将其指定为依赖项：

```json
{
  "dependencies": {
    "shared-utils": "*"
  }
}
```

上面是 npm 与 yarn 声明的规则, pnpm 有所不同：

```json
{
  "dependencies": {
    "shared-utils": "workspace:*"
  }
}
```

`*` 允许我们引用最新版本的依赖项, 如果我们的包的版本发生变化, 可以使得我们无需更改依赖项的版本。

就像普通的包一样, 相互依赖的工作区也需要进行 `npm install`。

如果工作区配置好了, 接下来就需要利用诸如 turborepo 这样的工具在 monorepo 中运行我们的任务。

## Turborepo

Turborepo 是一个针对 JavaScript 和 TypeScript 代码库优化的智能构建系统。

> [Turborepo](https://turbo.build/repo) is an intelligent build system optimized for JavaScript and TypeScript codebases.

### Turborepo 不是什么

Turborepo 不处理包的安装, 像 npm、yarn 亦或是 pnpm 已经够优秀了, 但是它们运行任务的效率却很低, 这意味着 CI 构建速度很慢。

所以最佳实践是用最喜欢的包管理器安装包, 使用诸如 Turborepo 这样的工具运行任务, 如 `run test`、`run build`。

### turbo 的使用

首先是安装 turbo：

```shell
pnpm install turbo --save-dev --workspace-root
```

然后需要创建 turbo.json 文件：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

turbo.json 中 `pipeline` 属性是用于设置管道的, 其内部每个属性是要用 turbo 执行的命令, 如 `dev`、`build`

这里要注意 `dependsOn` 的值的含义：

- `^build` 的含义是按照依赖关系顺序打包
- `build` 的含义是软件包无依赖关系, 可以并行操作

需要注意的是 dev 是不需要缓存的。

下面是生成一个 nomorepo 模板, 可借鉴一下：

```shell
npx create-turbo@latest
```

提一嘴, turbo 与 vercel 是一家公司, vercel 是网站托管服务。

## changeset

turbo 只会执行任务, 并没有集成版本管理部分, 如果需要进行版本管理, 可以使用 [changesets](https://github.com/changesets/changesets)。

安装 @changesets/cli 脚手架：

```shell
pnpm add -D @changesets/cli
```

初始化 changesets：

```shell
pnpm changeset init
```

在生成的 .changeset 文件夹中, 含有一个 config.json 文件：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.2.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "master",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

这里面 baseBranch 需换成想要的分支。

需要注意的是, 这个玩意最开始的时候必需要有 git, 需要 `git init`, 然后还必须 commit 过, 要不然没有 commit 时是没有 master 分支的。

如果需要创建新的变更, 可以：

```shell
pnpm changeset
```

然后可以根据创建的变更创建新的版本：

```
pnpm changeset version
```

如果想发布 npm 的话, 可以：

```sehll
pnpm changeset publish
```

但需要注意的是, 必须在想发布的 npm 包的 package.json 文件中指明此包为 public：

```json
"publishConfig": {
  "access": "public"
}
```

## Lerna 简介

[Lerna](https://lerna.js.org/) 是一个优化基于 git + npm 的多 package 项目管理工具。

### 优势

- 大幅减少重复操作
- 提升操作的标准化

Lerna 是架构优化的产物, 它揭示了一个架构真理：项目复杂度提升后, 就需要对项目进行架构优化。架构优化的主要目标往往都是以效能为核心。

Lerna 是 TS/JS 的原始 monorepo 工具。它解决了 JS monorepo 三个最大的问题：

- Lerna 链接了 repo 中不同项目, 由此它们可以相互导入而无需向 npm 发布任何内容
- Lerna 针对任意数量的项目运行一个命令, 它以最有效的方式、以正确的顺序执行, 并有可能将其分发到多台机器上
- Lerna 管理你的发布流程, 从版本管理到发布 npm, 它提供了多种选项以确保可以适应任何工作流程

像 Babel、vue-cli、create-react-app 都在使用 Lerna

### Lerna 开发脚手架流程

1. 脚手架项目初始化
   1. 初始化 npm 项目 `npm init -y`
   2. 安装 lerna
   3. `lerna init` 初始化项目
2. 创建 package
   1. `lerna create` 创建 package
   2. `lerna add` 安装依赖
   3. `lerna link` 链接依赖
3. 脚手架开发测试
   - `lerna exec` 执行 shell 脚本
   - `lerna run` 执行 npm 命令
   - `lerna clean` 清空依赖
   - `lerna bootstrap` 重装依赖
4. 脚手架发布上线
   - `lerna version`、`bump version`
   - `lerna changed` 查看上版本以来的所有变更
   - `lerna diff` 查看 diff
   - `lerna publish` 项目发布

### Lerna 使用

目前, Lerna 已经升级到了版本 6。

#### 创建 Lerna 工作区

1. `npm init -y` 初始化 npm 项目
2. `npx lerna@latest init` 创建 Lerna 工作区

运行 `npx lerna init` 时, 会：

- 添加 lerna 至根 package.json
- 生成一个 lerna.json
- 配置 npm/yarn/pnpm 工作区

注：运行时 `lerna init` 时，Lerna 将工作区配置为使用 NPM/YARN/PNPM 工作区，这是本地引用包的内置解决方案。

> 其实 Lerna 有自己的依赖管理解决方案：lerna bootstrap, 这是历史遗留产物。因为在 Lerna 首次发布时，没有可用的解决方案。

但是现在, 现代包管理器带有内置的“[工作区](https://docs.npmjs.com/cli/v9/using-npm/workspaces)”解决方案, 因此强烈建议改用它。

Lerna 有一段时间没维护了, 现在被收购维护了, 但有点不喜欢, 还是用 pnpm + turborepo + changesets 吧。
