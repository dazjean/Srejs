import { getCoreConfig, setCoreConfig } from './config';

export const isDev = () => {
    const NODE_ENV = (process.env && process.env.NODE_ENV) || 'development';

    return NODE_ENV.trim() !== 'production';
};
export const setOptions = (options) => {
    let coreOptions = Object.assign({}, getCoreConfig(), options);
    return setCoreConfig(coreOptions);
};
export const getOptions = (name) => {
    const options = getCoreConfig();
    return options[name] || null;
};
