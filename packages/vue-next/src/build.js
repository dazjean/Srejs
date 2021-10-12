import { WebpackVue } from '@srejs/vue-next-webpack';
export const build = async (page = true) => {
    WebpackVue.build(page);
};
