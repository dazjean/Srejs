import * as ExtractTextPlugin from 'mini-css-extract-plugin';
import common from '@srejs/common';

export const possLoader = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [
                require('autoprefixer')({ overrideBrowserslist: ['last 2 versions'] }),
                !common.isDev() ? require('cssnano') : null
            ]
        }
    }
};

const getCssLoader = () => {
    return {
        loader: 'css-loader',
        options: {
            url: true,
            modules: {
                auto: /\.module\.\w+$/i //https://github.com/webpack-contrib/css-loader#auto 通过文件格式来区分开启cssmodule 默认第三方组件库就不要使用css module
            }
        }
    };
};

export const loaderRules = (isServer = false) => {
    const cssLoader = getCssLoader();
    let envOptions = {
        modules: false
    };
    if (!isServer) {
        Object.assign(envOptions, {
            corejs: {
                version: 3.8,
                proposals: true
            },
            useBuiltIns: 'usage'
        });
    }
    return [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                compilerOptions: {
                    preserveWhitespace: false
                },
                extractCSS: true,
                cssModules: {
                    localIdentName: '[path][name]---[local]---[hash:base64:5]',
                    camelCase: true
                }
            }
        },
        {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    presets: [['@babel/preset-env', envOptions], '@babel/preset-typescript'],
                    plugins: [
                        ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            },
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-hot-loader',
                ExtractTextPlugin.loader,
                cssLoader,
                possLoader
            ]
        },
        {
            test: /\.styl(us)?$/,
            use: ['vue-style-loader', 'css-loader', 'stylus-loader']
        },
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-hot-loader',
                ExtractTextPlugin.loader,
                cssLoader,
                possLoader,
                {
                    loader: 'sass-loader'
                }
            ]
        },
        {
            test: /\.less$/,
            use: [
                'vue-style-loader',
                'css-hot-loader',
                ExtractTextPlugin.loader,
                cssLoader,
                possLoader,
                {
                    loader: 'less-loader'
                }
            ]
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[hash:8].[name].[ext]',
                        limit: 8192,
                        outputPath: 'images/'
                    }
                }
            ]
        }
    ];
};
