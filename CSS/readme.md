# CSS

CSS(cascading style sheet, 层叠样式表) 是用来给 HTML 标签添加样式的语言。

CSS3 是 CSS 的最新版本, 增加了大量的样式、动画、3D 特效和移动端特性等。

## CSS 书写位置

CSS 书写位置一共有四种：

- 内嵌式
- 外链式
- 导入式
- 行内式

### 内嵌式

```html
<head>
  <style>
    html {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
```

### 外链式

```html
<head>
  <link rel="stylesheet" href="./index.css" />
</head>
```

### 导入式

```html
<head>
  <style>
    @import url(./index.css);
  </style>
</head>
```

导入式是最不常见的样式导入方法, 使用导入式引入的样式表, 不会等待 CSS 文件加载完毕, 而是会立即渲染 HTML 结构, 所以页面会有几秒的"素面朝天"时间。

### 行内式

```html
<h2 style="color: yellow;">二级标题</h2>
```

## CSS 选择器

### CSS 基本语法

```css
/* 选择器 + 大括号, 每条语句分号必须写(最后一条语句分号可以不加)*/
html {
  color: red;
  font-size: 14px;
}
```

### 通配符选择器

通配符选择器 `*` 表示选择所有的元素, 但它有效率问题, 应该使用并集选择器。

```css
* {
  margin: 0;
  padding: 0;
}
```

### 标签选择器

标签选择器也叫做元素选择器, 它直接使用元素的标签名当作选择器, 将选择页面上所有该种标签。

```css
html {
  color: red;
}
```

标签选择器通常用于标签的初始化, 如 [reset css](https://meyerweb.com/eric/tools/css/reset/)

### ID 选择器

id 是一个标签的唯一标识, 不能定义重复的 id。id 的名称只能由 字母、数字、下划线和短横 构成, 且不能以数字开头, 字母区分大小写, 习惯上一般为小写字母。

```html
<div id="id">id 选择器</div>
```

CSS 选择器使用 `#` 前缀选择指定的 id 标签：

```css
#id {
  color: red;
}
```

### class 选择器

class 属性表示"类名", 类名的命名规范和 id 的命名规范相同。同一个标签可以同时属于多个类, 类名用空格隔开。

```html
<div class="c_r fs14">class 选择器</div>
```

CSS 选择器使用 `.` 前缀选择指定的 id 标签：

```css
.c_r {
  color: red;
}
.fs14 {
  font-size: 14px;
}
```

#### 原子类

可以将所有的常用字号、文字颜色、行高、外边距、内边距等都设置为单独的类, 这种做法称之为原子化 CSS, 如 [tailwindcss](https://tailwindcss.com/)

```css
.fs14 {
  font-size: 14px;
}
.fs16 {
  font-size: 16px;
}
```

### 复合选择器

复合选择器包括三种：

- 后代选择器
- 交集选择器
- 并集选择器

#### 后代选择器

CSS 选择器中, 使用空格表示 "后代", "后代" 并不一定是 "儿子"。后代选择器可以有很多空格, 隔开好几代。

```css
/* 选择类名为 box 的标签内部, 含有 spec 类名的 p 标签内部的 span 标签 */
.box p.spec span {
  color: red;
}
```

#### 交集选择器

CSS 选择器中, 连着写表示 "交集"。

```css
/* 选择含有 spec 类名的 p 标签 */
p.spec {
  color: red;
}
```

#### 并集选择器

CSS 选择器中, 逗号隔开表示 "并集"。

```css
/* 即选择 h2 标签, 又选择 p 标签 */
h2,
p {
  color: red;
}
```

### 伪类选择器

伪类是添加到选择器的描述性词语, 指定要选择元素的特殊状态。

#### anchor 伪类

给链接添加伪类顺序不能乱, 得遵循 **L**O**V**E **HA**TE (LVHA) 原则。

```css
/* 未访问过的状态 */
a:link {
  color: red;
}

/* 已访问过的状态 */
a:visited {
  color: red;
}

/* 鼠标悬停状态 */
a:hover {
  color: red;
}

/* 鼠标点击但未松开的状态 */
a:active {
  color: red;
}
```

#### CSS3 新增伪类

CSS3 新增伪类：

- `:empty` : 选择空标签
- `:focus` : 选择当前获得焦点的表单元素
- `:enabled` : 选择当前有效的表单元素
- `:disabled` : 选择当前无效的表单元素
- `:checked` : 选择当前已经勾选的单选按钮或者复选框
- `:root` : 选择根元素, 即 `<html>` 标签

```css
/* 选择没有任何子元素的 p 标签 */
p:empty {
  width: 50px;
  height: 50px;
  border: 1px solid #000;
}

/* 选择当前聚焦的 input 标签 */
input:focus {
  border: 1px solid #000;
}

/* 选择当前有效的能选中的 input 标签 */
input:enabled {
  border: 1px solid #000;
}

/* 选择无法选中的 input 标签 */
input:disabled {
  border: 1px solid #000;
}

/* 选择选中的单选按钮或复选框的 span 相邻兄弟标签 */
input:checked + span {
  color: red;
}

/* :root 相当于 html 标签 */
:root {
  margin: 0;
  padding: 0;
}
```

### 元素关系选择器

元素关系选择器有 3 种, 分别是：

- 子选择器
- 相邻兄弟选择器
- 通用兄弟选择器

#### 子选择器

```css
/* div 的子标签 p */
div > p {
  color: red;
}
```

#### 相邻兄弟选择器

```css
/* img 后面紧跟着的 p */
img + p {
  color: red;
}
```

#### 通用兄弟选择器

```css
/* p 元素之后所有同级的 span 元素 */
p ~ span {
  color: red;
}
```

### 序号选择器

注意, 序号选择器的正确用法是 `.box p:first-child`, 而不是 `.box:first-child`, 不要把它翻译成"里面的"。

`:nth-child()` 可以写成 an + b 的形式, 表示从 b 开始每 a 个选一个, 注意不能写为 b + an。

```css
/* box 类第一个元素是 p 标签的话将被选中 */
.box p:first-child {
  color: red;
}

/* box 类最后一个元素是 p 标签的话将被选中 */
.box p:last-child {
  color: red;
}

/* box 类第 3 个元素是 p 标签的话将被选中 */
.box p:nth-child(3) {
  color: red;
}

/* box 类倒数第 3 个元素是 p 标签的话将被选中 */
.box p:nth-last-child(3) {
  color: red;
}

/* box 类第 3 个 p 标签的话将被选中 */
.box p:nth-of-type(3) {
  color: red;
}

/* box 类倒数第 3 个 p 标签的话将被选中 */
.box p:nth-last-of-type(3) {
  color: red;
}
```

### 属性选择器

```css
/* 选择含有 alt 属性的 img 标签 */
img[alt] {
  width: 100px;
}

/* 选择含有 alt 属性是 avatar 的 img 标签 */
img[alt='avatar'] {
  width: 100px;
}

/* 选择 alt 属性以 avatar 开头的 img 标签 */
img[alt^='avatar'] {
  width: 100px;
}

/* 选择 alt 属性以 avatar 结尾的 img 标签 */
img[alt$='avatar'] {
  width: 100px;
}

/* 选择 alt 属性中含有 avatar 的 img 标签 */
img[alt*='avatar'] {
  width: 100px;
}

/* 选择 alt 属性中有空格隔开的 avatar 字样的 img 标签 */
img[alt~='avatar'] {
  width: 100px;
}

/* 选择 alt 属性以 avatar- 开头的 img 标签 */
img[alt|='avatar'] {
  width: 100px;
}
```

### 伪元素

CSS 新增了 "伪元素" 特性, 顾名思义, 表示虚拟动态创建的元素。伪元素用双冒号表示, 一共有 5 种：

- `::before` : 创建一个伪元素, 其将成为匹配选中元素的第一个**子**元素, 必须设置 content 属性表示其中的内容
- `::after` : 创建一个伪元素, 其将成为匹配选中元素的最后一个**子**元素, 必须设置 content 属性表示其中的内容
- `::selection` : 文档中被用户使用鼠标圈选的部分将被命中
- `::first-letter` : 块级元素中第一行第一个字母将被命中, 常用于英文首字母大写
- `::first-line` : 块级元素中第一行的全部文字将被命中

```css
/* a 元素的第一个子元素为 ❤ */
a::before {
  content: '❤';
}

/* a 元素的最后一个子元素为 ❤ */
a::after {
  content: '❤';
}

/* box 类内文档用鼠标圈选将被命中 */
.box::selection {
  background-color: red;
}

/* p 标签内文档第一个首字母将被选中 */
p::first-letter {
  color: red;
}
/* p 标签内文档第一行将被选中 */
p::first-line {
  text-decoration: none;
}
```

### 层叠性和选择器权重

#### 层叠性

CSS 全面叫做 "层叠式样式表", 层叠性是它很重要的性质, 多个选择器可以同时作用于同一个标签, 效果叠加。

```css
/* text 类里 p 标签的文字的颜色是 red */
p {
  font-size: 14px;
}

.text {
  color: red;
}
```

#### 选择器权重

复杂选择器可以通过 (id 的个数, class 的个数, 标签的个数) 的形式, 计算权重。

```css
/* (2, 0, 1) 优先级其次 */
#box1 #box2 p {
  color: red;
}

/* (2, 1, 2) 优先级最高 */
#box1 div.box2 #box3 p {
  color: green;
}

/* (0, 3, 1) 优先级最低 */
.box1 .box2 .box3 p {
  color: blue;
}
```

#### !important

如果需要将某个选择器的某条属性提升权重, 可以在属性后面写 !important

```css
.spec {
  color: red !important;
}
```

## 文本相关属性

### 字体

字体文件根据操作系统和浏览器的不同, 有 eot、woff2、woff、ttf 和 svg 文件格式。当拥有字体文件后, 可以使用 `@font-face` 定义字体：

```css
@font-face {
  font-family: '字体名称';
  font-display: swap;
  src: url('eot 字体文件地址');
  src: url('eot 字体文件地址') format('embedded-opentype'), url('woff2 字体文件地址') format('woff2'),
    url('woff 字体文件地址') format('woff'), url('ttf 字体文件地址') format('truetype'),
    url('svg 字体文件地址') format('svg');
}
```

### 继承性

文本相关的属性普遍具有继承性, 只需要给祖先标签设置, 即可在后代所有标签中生效

- color
- font- 开头的
- list- 开头的
- text- 开头的
- line- 开头的

#### 就近原则

在继承的情况下, 选择器权重计算失效, 而是就近原则。

## 盒模型

所有的 HTML 标签都可以看成是一个矩形盒子, 由 width、height、padding、border 构成, 称为"盒模型"。

### 标准盒模型与怪异盒模型

在标准盒模型中, 盒子是"外扩"的, 盒子实际宽高为：

- realWidth = width + 两边 padding + 两边 border
- realHeight = height + 上下 padding + 上下 border

在怪异盒模型中, 盒子是"内缩"的, 盒子实际宽高为就是定义的 width 和 height。

```css
.box {
  box-sizing: border-box;
}
```

将 box-sizing 设置为 border-box 即可变为怪异盒模型, 在移动端配合 flex 布局非常好用。

### margin 塌陷

竖直方向的 margin 有塌陷现象, 小的 margin 会塌陷到大的 margin 中, margin 不叠加, 只以大值为准。

### 盒子水平居中

将盒子左右两边的 margin 都设置为 auto, 盒子将水平居中。

```css
.box {
  margin: 0 auto;
}
```

### 行内元素和块级元素

块级元素可以设置宽高, width 自动撑满。行内元素不能设置宽高, 也不能设置上下 margin, 并排显式, width 自动收缩。

### 元素隐藏

```css
/* 元素将彻底放弃位置, 就好像没有写它的标签一样 */
.box1 {
  display: none;
}
/* 元素不放弃自己的位置, 就好像透明了 */
.box2 {
  visibility: hidden;
}
```

## 浮动与定位

### BFC

BFC(Box Formatting Context, 块级格式化上下文), 是页面上的一个隔离的独立容器, 容器里面的子元素不会影响到外面的元素, 反之亦然。

#### 如何创建 BFC

1. float 的值不是 none
2. position 的值不是 static 或者 relative
3. display 的值是 inline-block、flex 或者 inline-flex
4. `overflow: hidden;`

#### BFC 的用途

1. BFC 可以取消盒子的 margin 塌陷
2. 还可以阻止元素被浮动元素覆盖

### 浮动

浮动最本质的功能：用来实现并排。

#### 浮动的使用

- 垂直显式的盒子不要设置浮动, 只有并排显式的盒子才要设置浮动
- 要浮动, 并排的盒子都要设置浮动, 且父盒子要有足够的宽度, 否则子盒子会掉下去
- 浮动的元素不再区分块级元素、行内元素, 已经脱离了标准文档流, 一律能设置宽高, 即使是 span 标签
- 浮动具有顺序贴靠特性, 子元素会按顺序进行贴靠, 如果没有足够空间, 则会寻找再前一个兄弟元素

#### 清除浮动

1. 让内部有浮动的父盒子形成 BFC, 它就能闭住内部的浮动。最好的办法是添加 `overflow: hidden;` 属性
2. 给后面的父盒子设置 `clear: both;` 属性。clear 表示清除浮动对自己的影响, both 表示左右浮动都清除
3. 使用 `::after` 伪元素给父盒子添加最后一个子元素, 并给 `::after` 设置 `clear: both;`, 注意, `::after` 必须是块级元素
4. 在两个父盒子之间"隔墙",隔一个携带 `clear: both;` 的盒子

### 定位

#### 相对定位

相对定位的元素并不会释放自己的位置。

```css
.box {
  position: relative;
}
```

相对定位的用途：

- 微调元素位置
- 当作绝对定位的参考盒子

#### 绝对定位

绝对定位的元素会脱离标准文档流, 将释放自己的位置, 对其它元素不会产生任何干扰, 而是对它们进行压盖。

```css
.box {
  position: absolute;
}
```

绝对定位的盒子并不是永远以浏览器作为基准点。绝对定位的盒子会以自己祖先元素中, 离自己最近的拥有定位属性的盒子, 当作基准点。这个盒子通常是相对定位的, 所以这个性质也叫做"子绝父相"

#### 固定定位

固定定位只能以页面为参考点, 也会脱离标准文档流。

```css
.box {
  position: fixed;
}
```

#### 粘性定位

```css
.box {
  position: sticky;
}
```
