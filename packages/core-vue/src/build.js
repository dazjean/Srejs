import { WebpackVue } from '@srejs/webpack';
export const build = async (page = true) => {
    WebpackVue.build(page);
};
