# HtmlTemplate

## 默认模板
框架内置`HTMLWebpackPlugin`提供了默认的构建输出的html模板
```
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
    <title>srejs-webapp-<%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
    <div id="app"></div>
    <script type="text/javascript">
         window.onload = function() {
            function t() {
                n.style.fontSize = 16 * e().width / 375 + "px"
            }

            function e() {
                return {
                    width: document.documentElement.clientWidth || document.body.clientWidth,
                    height: document.documentElement.clientHeight || document.body.clientHeight
                }
            }
            var n = document.querySelector("html");
            t();
            var i = 375;
            window.onresize = function() {
                window.outerWidth != i && (i = e().width,
                    n.style.fontSize = 16 * i / 375 + "px")
            }   
        };
    </script>
    </body>

</html>
```

## 自定义模板
为满足业务引入第三方脚本也提供了以下方式自定义html模板。
- `src/pages/xxx/index.html`（局部）
- `src/index.html`（全局）

`src/pages/xxx/index.html` > `src/index.html`