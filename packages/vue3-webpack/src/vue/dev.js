import { getBaseconfig } from './base';
import combine from './combine';

export function getDevConfig(page, isServer, hotReload = false) {
    let config = getBaseconfig(page, isServer, hotReload);
    return combine(config, false);
}
