import webPack from './webpack/run';

export const build = async (page = true) => {
    await new webPack(page, false, false).run(); // 客户端代码编译
    await new webPack(page, false, true).run(); // 服务端代码编译
};
