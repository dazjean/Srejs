import { WebpackReact } from '@srejs/react-webpack';
export const build = async (page = true) => {
    WebpackReact.build(page);
};
