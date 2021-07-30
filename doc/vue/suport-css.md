# 内置css支持
> 框架内置了`vue-style-loader`以及css预处理器loader,支持`*.vue`单个文件组件内的 `<style>`提取为单独css样式文件。也支持CSS Modules。以下示例均开箱即用，无需额外配置。

## Scoped CSS
```vue
<template>
    <p class="scoped">
    style scoped
  </p>
</template>

<style scoped>
.scoped {
  color: red;
  font-size: 18px;
}
</style>
```

## 预处理器less/scss
```vue
<template>
    <p class="scoped">
    style scoped
  </p>
</template>

<style lang="less" scoped>
.scoped {
  color: red;
  font-size: 18px;
}
</style>

<style lang="scss" scoped>
.scoped_scss {
  color: red;
  font-size: 18px;
}
</style>
```

**当我们采用*.less或者*.scss文件编写样式时，也可以从 JavaScript 中导入 CSS，例如，import './foo.css'**

## CSS Modules
- 使用style module
> 在你的 `<style> `上添加 module 特性,这个 module 特性指引 Vue Loader 作为名为 $style 的计算属性，向组件注入 CSS Modules 局部对象。然后你就可以在模板中通过一个动态类绑定来使用它了。
```vue
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```
**详细原理查看官方文档[vue-loader](https://vue-loader.vuejs.org/zh/guide/css-modules.html#css-modules)**

- 使用预处理器样
> 如果你的样式是从JavaScript中导入的，那么你只需要将把文件命名为`*.module.(less|scss|css)`。
```vue
<template>
    <p :class="styles.module">
    对于外部样式文件，框架默认支持以文件命名:
    xxx.module.(less|scss|css)
    开启使用css module  
  </p>
</template>

<script>
import styles from './index.module.less';
export default {
    data () {
      styles
    }
}
</script>
```