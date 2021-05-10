import { getBaseconfig } from './base';

function getDevconfig(page, isServer) {
    let config = getBaseconfig(page, isServer);
    return config;
}

module.exports = {
    getDevconfig
};
