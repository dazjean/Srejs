import { getBaseconfig } from './base';

export function getDevConfig(page, isServer) {
    let config = getBaseconfig(page, isServer);
    return config;
}
