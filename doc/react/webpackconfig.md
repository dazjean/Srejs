
# webpack
srejs基于webpack@4.0+,Bable@7.0+进行项目编译,默认集成配置项如下
## loader
- babel-loader
- less-loader
- css-loader
- sass-loader
- postcss-loader
- url-loader

## alias

```js
alias: {
        components: rootDir + '/components',
        images: rootDir + '/images',
        mock: rootDir + '/mock',
        skin: rootDir + '/skin',
        utils: rootDir + '/utils',
        config: rootDir + '/config'
    }
```

## DefinePlugin
开发者在js中通过`process.env.NODE_ENV`可以进行环境的区分。
```
'process.env': NODE_ENV: JSON.stringify(dev ? 'development' : 'production')
```

## devServer
- `port:8080`
- `hot:true`
- `contentBase: ${rootDir}`

# 自定义webpack
srejs支持自定义webpack中的指定配置项 

## 支持的配置项
```
// webpack.config.js
module.exports = {
    loader: {
        js: [],
        jsx: [],
        css: [],
        scss: [],
        less: [],
        img: []
    }, // 新增的loader框架默认loader配置之后执行
    externals: {
    }, 
    extensions: [],
    alias: {
        images: path.join(process.cwd() + '/src/images')
    },
    plugins: []
 };
```