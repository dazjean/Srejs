import { getBaseconfig } from './base';
import { getPlugin } from './plugin';
import combine from './combine';

function getProconfig(page, isServer) {
    let config = getBaseconfig(page);

    let buildConfig = Object.assign({}, config, {
        devtool: false,
        mode: 'production',
        plugins: [...getPlugin(config.entry, isServer)]
    });
    return combine(buildConfig, false);
}

module.exports = {
    getProconfig
};
