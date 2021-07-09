import { getBaseconfig } from './base';

export function getDevConfig(page, isServer, hotReload = false) {
    let config = getBaseconfig(page, isServer, hotReload);
    return config;
}
