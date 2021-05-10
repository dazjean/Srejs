import fs from 'fs';
import { webpackConfigPath } from '../tools';

const loaderDefaultArr = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.less',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg'
];
function isSameLoader(loader1, loader2) {
    const loader1Name = typeof loader1 === 'string' ? loader1 : loader1.loader;
    const loader2Name = typeof loader2 === 'string' ? loader2 : loader2.loader;
    return loader1Name === loader2Name;
}
function mergeLoader(before, item) {
    if (item && item.length) {
        //如果有则覆盖，没有则添加 双指针：一个beforeIndex指向原有默认配置，一个itemIndex指向用户配置
        //1.loader相同 beforeIndex++ && itemIndex++,覆盖
        //2.loader不相同 beforeIndex++,添加
        const beforeLength = before.use.length,
            itemLength = item.length;
        let beforeIndex = 0,
            itemIndex = 0;
        while (beforeIndex < beforeLength && itemIndex < itemLength) {
            if (isSameLoader(before.use[beforeIndex], item[itemIndex])) {
                before.use[beforeIndex] = item[itemIndex];
                beforeIndex++;
                itemIndex++;
            } else {
                beforeIndex++;
            }
        }
        if (itemIndex < itemLength) {
            //用户配置
            before.use.push(...item.slice(itemIndex));
        }
    }
}
//loader单独处理
function loaderConfig(userConfigLoader, config) {
    //添加loader
    let defaultLoader = config.module.rules;
    userConfigLoader &&
        Object.entries(userConfigLoader).map(([key, item]) => {
            switch (key) {
                case 'js':
                    mergeLoader(defaultLoader[0], item);
                    break;
                case 'jsx':
                    mergeLoader(defaultLoader[1], item);
                    break;
                case 'ts':
                    mergeLoader(defaultLoader[2], item);
                    break;
                case 'tsx':
                    mergeLoader(defaultLoader[3], item);
                    break;
                case 'css':
                    mergeLoader(defaultLoader[4], item);
                    break;
                case 'scss':
                    mergeLoader(defaultLoader[5], item);
                    break;
                case 'less':
                    mergeLoader(defaultLoader[6], item);
                    break;
                case 'img':
                    mergeLoader(defaultLoader[7], item);
                    break;
                case 'other':
                    //没有默认loader的文件添加
                    item.length &&
                        item.map((loader) => {
                            !loaderDefaultArr.some((loaderDefault) =>
                                loaderDefault.match(loader.test)
                            ) && defaultLoader.push(loader);
                        });
                    break;
                default:
            }
        });
}
module.exports = function (config) {
    if (!fs.existsSync(webpackConfigPath)) {
        return config;
    }
    delete require.cache[require.resolve(webpackConfigPath)];
    const customConfig = require(webpackConfigPath);
    if (!customConfig) return config;
    Object.entries(customConfig).map(([key, val]) => {
        switch (key) {
            case 'loader':
                loaderConfig(val, config);
                break;
            case 'externals':
                //添加externals 合并
                config.externals = val
                    ? Object.assign(config.externals || {}, val)
                    : config.externals;
                break;
            case 'extensions':
                //添加extensions 合并去重
                config.resolve.extensions =
                    val && val.length
                        ? Array.from(new Set([...config.resolve.extensions, ...val]))
                        : config.resolve.extensions;
                break;
            case 'alias':
                //添加alias 覆盖
                config.resolve.alias = val || config.resolve.alias;
                break;
            case 'plugins':
                //添加plugin 合并
                config.plugins = val ? config.plugins.concat(val) : config.plugins;
                break;
            default:
                //直接覆盖操作
                config[key] = val || config[key] || '';
                break;
        }
    });
    return config;
};
