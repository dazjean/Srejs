import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { getDevconfig } from './webpack/dev';
export const dev = (page = true) => {
    let webpackConfig = getDevconfig(page);
    const compiler = webpack(webpackConfig);
    const devServerOptions = Object.assign(
        {},
        {
            port: '8080',
            stats: {
                colors: true
            }
        },
        webpackConfig.devServer
    );
    const server = new webpackDevServer(compiler, devServerOptions);

    server.listen(devServerOptions.port, '127.0.0.1', () => {
        console.log('srejs:Starting server on http://localhost:' + devServerOptions.port);
    });
};
