# vue2-elm 项目工程化升级

## 前言

原项目源码：https://github.com/bailicangdu/vue2-elm

主要依赖版本：

```json
{
  "vue": "^2.1.0",
  "vue-router": "^2.1.1",
  "vuex": "^2.0.0",
  "webpack": "^1.13.2"
}
```

### 改造目标

1. Vue 升级改造

- 项目初始化
- vue 全家桶插件升级
- vuex 和 vue-router 语法升级
- 移植首页

2. Webpack 打包改造

- webpack 升级
- css 压缩
- js 分离 + 压缩
- 升级 Babel 配置
- 打包文件启动 (nginx)

3. 项目打包构建优化

- 构建速度分析
- 构建体积分析
- 多进程/多实例 thread-loader
- 多进程/多实例并行压缩代码
- 利用缓存提升二次构建速度
- 缩小构建目标
- 图片压缩
- 删除 CSS 未使用内容

4. 打包体积对比

## vue-cli2 构建源码解析

### webpack-dev-middleware 源码解析

1. 依赖 memory-fs 库将构建结果全部存储到内存中

```js{13}
setFs: function(compiler) {
  if(typeof compiler.outputPath === "string" && !pathIsAbsolute.posix(compiler.outputPath) && !pathIsAbsolute.win32(compiler.outputPath)) {
    throw new Error("`output.path` needs to be an absolute path or `/`.");
  }

  // store our files in memory
  var fs;
  var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
  if(isMemoryFs) {
    fs = compiler.outputFileSystem;
  } else {
    fs = compiler.outputFileSystem = new MemoryFileSystem();
  }
  context.fs = fs;
},
```

2. 开启了 webpack 的监听模式 `-w`

```js{6}
startWatch: function() {
  var options = context.options;
  var compiler = context.compiler;
  // start watching
  if(!options.lazy) {
    var watching = compiler.watch(options.watchOptions, share.handleCompilerCallback);
    context.watching = watching;
  } else {
    context.state = true;
  }
},
```

3. 实现请求中间件, 用于处理所有资源请求, 并到内存中查询相应文件返回, 相当于是实现了 express.static() 效果。
