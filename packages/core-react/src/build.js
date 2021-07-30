import { WebpackReact } from '@srejs/webpack';
export const build = async (page = true) => {
    WebpackReact.build(page);
};
