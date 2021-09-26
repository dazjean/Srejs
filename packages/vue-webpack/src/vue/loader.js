import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
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

const sassLoader = {
    loader: 'sass-loader',
    options: {
        // Prefer `dart-sass`
        implementation: require('sass')
    }
};

const getCssLoader = () => {
    return {
        loader: 'css-loader',
        options: {
            url: true,
            modules: {
                localIdentName: '[local]_[hash:base64:5]',
                auto: /\.module\.\w+$/i //https://github.com/webpack-contrib/css-loader#auto 通过文件格式来区分开启cssmodule 默认第三方组件库就不要使用css module
            }
        }
    };
};

const getCssModuleLoader = () => {
    return {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: '[local]_[hash:base64:5]'
            }
        }
    };
};

const getCommonLoader = () => {
    const commonDevLoader = ['vue-style-loader'];
    const commonProdLoader = [MiniCssExtractPlugin.loader];
    return common.isDev() ? commonDevLoader : commonProdLoader;
};

export const loaderRules = (isServer = false) => {
    const cssLoader = getCssLoader();
    const cssModuleLoader = getCssModuleLoader();
    const commonLoader = getCommonLoader();
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
                        '@babel/plugin-transform-modules-commonjs',
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            },
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: [...commonLoader, cssModuleLoader, possLoader]
                },
                {
                    use: [...commonLoader, cssLoader, possLoader]
                }
            ]
        },
        {
            test: /\.styl(us)?$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: [...commonLoader, cssModuleLoader, possLoader, 'stylus-loader']
                },
                {
                    use: [...commonLoader, cssLoader, possLoader, 'stylus-loader']
                }
            ]
        },
        {
            test: /\.scss$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: [...commonLoader, cssModuleLoader, possLoader, sassLoader]
                },
                {
                    use: [...commonLoader, cssLoader, possLoader, sassLoader]
                }
            ]
        },
        {
            test: /\.less$/,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: [...commonLoader, cssModuleLoader, possLoader, 'less-loader']
                },
                {
                    use: [...commonLoader, cssLoader, possLoader, 'less-loader']
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
        },
        {
            test: /\.(eot|woff|woff2|ttf)(\?.*)?$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[hash:8].[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            ]
        }
    ];
};
