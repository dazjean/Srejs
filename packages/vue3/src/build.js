import { WebpackVue } from '@srejs/vue3-webpack';
export const build = async (page = true) => {
    WebpackVue.build(page);
};
