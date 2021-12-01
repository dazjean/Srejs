import fs from 'fs';
import merger from 'webpack-merge';
import { webpackConfigPath } from '@srejs/common';

module.exports = function (config, isServer) {
    if (!fs.existsSync(webpackConfigPath)) {
        return config;
    }
    let customConfig = config;
    delete require.cache[require.resolve(webpackConfigPath)];
    const configureWebpack = require(webpackConfigPath);
    if (typeof configureWebpack === 'function') {
        // apply customConfig
        customConfig = Reflect.apply(configureWebpack, config, [config, isServer ? 'ssr' : 'csr']);
    }

    if (typeof configureWebpack === 'object') {
        // webpack-merge
        customConfig = merger(config, configureWebpack);
    }

    return customConfig;
};
