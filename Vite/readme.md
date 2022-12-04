# Vite

Vite 是一种新型的前端构建工具, 主要由两部分组成：

- 一个开发服务器
- 一套构建指令

开发服务器基于原生 ES 模块提供了丰富的内建功能, 如速度快到惊人的热模块热更新(HMR)。

构建指令使用 rollup 打包代码, 是预配置的, 可输出用于生产环境的高度优化过的静态资源。

Vite 意在提供开箱即用的配置, 同时它的 插件 API 和 JavaScript API 带来了高度的可扩展性, 并有完整的类型支持。

## index.html 与项目根目录

在开发期间 Vite 是一个服务器, 而 `index.html` 是该 Vite 项目的入口文件。

对于非常基础的使用来说, 使用 Vite 开发和使用一个静态文件服务器没有太大区别。然而, Vite 还通过原生 ESM 导入提供了许多主要用于打包场景的增强功能。

## Vite 功能

可以想象成内置了一系列 loader 的 dev-server

### npm 依赖解析和预构建

原生 ES 不支持裸模块导入：

```js
import { someMethod } from 'my-dep'
```

Vite 会检测所有被加载到源文件中的裸模块导入, 并执行以下操作：

1. 预构建: 预构建这一步由 esbuild 执行, 可以将 CommonJS / UMD 转换为 ESM 格式, 且可以提高页面加载速度
2. 重写导入为合法的 URL, 例如 `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` 以便浏览器能够正确导入它们

依赖是强缓存的, Vite 通过 HTTP 头来缓存请求得到的依赖。

### HMR

Vite 提供了一套基于原生 ESM 的 HMR API。Vite 内置了 HMR 到 Vue 单文件组件(SFC) 和 React Fast Refresh 中。

当通过 `create-vite` 或 `create-vue` 脚手架创建应用程序时, 所选的模板已经预配置了这些, 不需要手动设置。

### Vue

Vite 为 Vue 提供第一优先级支持：

- Vue3 单文件组件支持：[@vite/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue3 JSX 支持：[@vite/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)
- Vue2.7 支持：[@vitejs/vite-plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Vue<2.7 支持：[underfin/vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

### TypeScript

Vite 天然支持引入 `.ts` 文件。

Vite 仅支持 `.ts` 文件的转译工作, 并不执行任何的类型检查。类型检查的部分可以交给 IDE 或构建过程接管。

可以在构建脚本中运行 `tsc --noEmit` 或者安装 `vue-tsc` 然后运行 `vue-tsc --noEmit` 来对 `.*vue` 文件做类型检查。

使用仅含类型的导入和导出形式的语法可以避免潜在的"仅含类型的导入被不正确打包"的问题：

```ts
import type { T } from 'only/types'
export type { T }
```

Vite 使用 esbuild 将 TypeScript 转译到 JavaScript, 约是 `tsc` 速度的 20~30 倍, 同时 HMR 更新反映到浏览器的时间小于 50ms。

#### TypeScript 编译器选项

`tsconfig.json` 中 `compilerOptions` 下的一些配置项需要特别注意。

##### isolateModules

应该设置为 `true`。

这是因为 esbuild 只执行没有类型信息的转译, 它并不支持某些特性, 如 `const enum` 和隐形类型导入。

必须在 `tsconfig.json` 中的 `compilerOptions` 下设置 `"isolateModules": true`。如此做, TS 会警告你不要使用隔离（isolated）转译的功能。

然而, 一些库(如 vue)不能很好的与 `"isolateModules": true` 共同工作, 可以在上游仓库修复好之前暂时使用 `"skipLibCheck: true"` 来缓解这个错误。

如果代码库很难迁移到 `"isolatedModules": true`, 可以尝试通过第三方插件来解决, 比如 rollup-plugin-friendly-type-imports。但是, 这种方式不被 Vite 官方支持。

#### 客户端类型

Vite 默认的类型定义是写给它的 Node.js API 的。要将其补充到一个 Vite 应用的客户端代码环境中, 需要添加一个 `.d.ts` 声明文件：

```ts
/// <reference types="vite/client" />
```

也可以将 `vite/client` 添加到 `tsconfig` 中的 `compilerOptions.types` 下：

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

这将会提供以下类型定义补充：

- 资源导入(例如：导入一个 `.svg` 文件)
- `import.meta.env` 上 Vite 注入的环境变量的类型定义
- `import.meta.hot` 上的 HMR API 类型定义

要覆盖默认的类型定义, 需要在三斜线注释前添加定义。例如, 要为 React 组件中的 `*.svg` 文件定义类型：

```ts
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}

/// <reference types="vite/client" />
```

### JSX 

`.jsx` 和 `.tsx` 文件同样开箱即用。JSX 的转译同样是通过 esbuild。

Vue 用户应使用官方提供的 @vitejs/plugin-vue-jsx 插件, 它提供了 Vue3 特性的支持, 包括 HMR, 全局组件解析, 指令和插槽。
