/// <reference types="node" />
import * as Koa from 'koa';

type TssrOptions = {
    ssr: boolean;
    cache?: boolean;
};

type TcoreOptions = {
    ssr?: boolean; // 开启服务端渲染
    cache?: boolean; // 开启缓存
    rootDir?: string; // 工程根文件夹目录名称
    rootNode?: string; // 客户端渲染挂载根元素ID
    prefixCDN: string, // 构建后静态资源CDN地址前缀
    prefixRouter: string, // 默认页面路由前缀(在defaultRouter设置为true时有效)
    log?:boolean // 开发环境日志输出
};

declare class Srejs {
    /**
     *
     * @param app koa实例
     * @param dev 默认true,将改写process.env.NODE_ENV为development
     * @param defaultRouter 使用默认路由 默认false
     * @param options 框架配置属性
     */
    constructor(app: Koa, dev?: boolean, defaultRouter?: boolean, options?: TcoreOptions);
    /**
     *
     * @param ctx
     * @param viewName 页面组件名称
     * @param initProps 初始化props
     * @param options 局部属性
     */
    render(ctx: Koa.Context, viewName: string, initProps?: object, options?: TssrOptions): Promise<string>;
}

export default Srejs;
