import { getVueDevConfig as getDevConfig, Webpack, WebpackDevServer } from '@srejs/vue3-webpack';
export const dev = (page = true) => {
    let webpackConfig = getDevConfig(page);
    const compiler = Webpack(webpackConfig);
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
    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(devServerOptions.port, '127.0.0.1', () => {
        console.log('srejs:Starting server on http://localhost:' + devServerOptions.port);
    });
};
