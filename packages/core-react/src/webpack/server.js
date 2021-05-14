import { serverDir } from '../tools';
import { getBaseconfig } from './base';
import combine from './combine';
import ExtractTextPlugin from 'mini-css-extract-plugin';

function getServerconfig(page) {
    let baseConfig = getBaseconfig(page, true);
    let config = {
        ...baseConfig,
        watch: true,
        target: 'node',
        output: {
            publicPath: '/',
            libraryTarget: 'umd',
            globalObject: 'this', //webpack4之后如果umd构建在浏览器和node环境中均可使用需要设置成this
            filename: '[name].js', //打包后输出文件的文件名
            path: serverDir //打包后的文件存放的地方
        },
        externals: {
            react: {
                amd: 'react',
                root: 'React',
                commonjs: 'react',
                commonjs2: 'react'
            },
            'react-dom': {
                amd: 'react-dom',
                root: 'ReactDOM',
                commonjs: 'react-dom',
                commonjs2: 'react-dom'
            },
            'react-router-dom': {
                amd: 'react-router-dom',
                root: 'ReactRouterDom',
                commonjs: 'react-router-dom',
                commonjs2: 'react-router-dom'
            }
        },
        plugins: [
            new ExtractTextPlugin({
                filename: `[name].css`
            })
        ]
    };
    return combine(config, true);
}
module.exports = getServerconfig;
