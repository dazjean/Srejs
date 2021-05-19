# 自定义html
> 框架内置`HTMLWebpackPlugin`插件，开发者在页面组件同级目录下可以覆盖默认html模板自定义引入第三方资源和脚本。

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
    <meta name="keywords" content="">
    <title>srejs</title>
    <!-- 引入第三方组件库样式 -->
</head>
<body>
    <div id="app"></div>
    <!-- 引入第三方sdk脚本 -->
</body>
</html>
```

## 自定义模板文件命名规则
为满足业务引入第三方脚本也提供了以下方式自定义html模板。
- `src/pages/xxx/index.html`（局部页面生效）
- `src/index.html`（全局生效）

**优先级**`src/pages/xxx/index.html` > `src/index.html`