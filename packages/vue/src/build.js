import { WebpackVue } from '@srejs/vue-webpack';
export const build = async (page = true) => {
    WebpackVue.build(page);
};
