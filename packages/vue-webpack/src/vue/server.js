import nodeExternals from 'webpack-node-externals';
import common, { serverDir, cwd } from '@srejs/common';
import { getBaseconfig } from './base';
import combine from './combine';

export function getServerconfig(page) {
    let baseConfig = getBaseconfig(page, true);
    let additionalModuleDirs = [cwd + '/node_modules'];
    if (common.isDev()) {
        additionalModuleDirs.push(cwd);
    }
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
        externals: [nodeExternals({ allowlist: [/\.(css|vue)$/], additionalModuleDirs })]
    };
    return combine(config, true);
}
