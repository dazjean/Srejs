
# webpack

srejs基于webpack@4.0+,Bable@7.0+进行项目编译,默认集成配置项如下

## loader

- babel-loader
- less-loader
- css-loader
- sass-loader
- postcss-loader
- url-loader

## alias默认别名

```js
alias: {
        @: rootDir,
        components: rootDir + '/components',
        images: rootDir + '/images',
    }
```

## DefinePlugin

开发者在js中通过`process.env.NODE_ENV`可以进行环境的区分。

```shell
'process.env': NODE_ENV: JSON.stringify(dev ? 'development' : 'production')
```

# 覆盖或者新增webpack配置

srejs支持自定义webpack配置，在项目根目录下创建webpack.config.js。文件支持导出对象或者函数。

- 函数 【推荐】
函数接受两个参数，第一个为框架内置webpack配置对象;第二个参数可区分ssr和csr模式。

```js
module.exports = (configureWebpack, type) => {
    if (type == 'ssr') {
        //服务端渲染配置
    } else if (type === 'csr') {
        //客户端构建配置
        // configureWebpack.module.rules[0].exclude = /\/node_module\/!(antd.*)/;
    }

    return configureWebpack;
};
```

- 对象
对象配置属性将通过webpack-merge和框架内置属性进行合并。此方法适用于同时设置客户端和服务端渲染模式相同的配置。

```js
module.exports = {
    // module
    module:{
        rules:[
            // other loader
        ]
    }
}

```
