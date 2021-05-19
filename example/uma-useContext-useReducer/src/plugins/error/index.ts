import * as Koa from 'koa';
import { Uma, IContext } from '@umajs/core';

export type Options = {};

export default (_uma: Uma, _options: Options = {}): Koa.Middleware => async (ctx: IContext, next: Function) => {
    try {
        await next();
    } catch (e) {
        return ctx.reactView('error', { msg: e }, { cache: false });
    }
};
