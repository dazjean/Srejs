# SEO和HTML

在`initProps`中通过,默认接收`title,keywords,description`作为页面标题，关键字，网页描述填充字段。

```js
Sre.render(ctx,'list',{title:'xxx',keywords:'xxx',description:'xxxx'});
```

## 自定义html

框架内置`HTMLWebpackPlugin`插件，开发者在页面组件同级目录下可以覆盖默认html模板自定义引入第三方资源和脚本。自定义html文件名为页面下的`index.html`。

```html
<!-- web/pages/index/index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta name="format-detection" content="address=no;">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <title>vue ssr</title>
    <!-- 引入第三方组件库样式 -->
</head>
<body>
  <div id='app'></div>
</body>
<!-- 引入第三方sdk脚本 -->
</html>
```

在html模板中，还可以使用模板插值。服务端渲染初始化时传递的`initProps`数据在服务端渲染时会被注入为`渲染上下文对象`。

```html
<html>
  <head>
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>

    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

## 支持全局HTML

为满足业务引入第三方脚本也提供了以下方式自定义html模板。

- `web/pages/xxx/index.html`（局部页面生效）
- `web/index.html`（全局生效）

**优先级**`web/pages/xxx/index.html` > `web/index.html`
