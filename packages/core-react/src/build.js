import Webpack from './webpack/index';
export const build = async (page = true) => {
    Webpack.build(page);
};
