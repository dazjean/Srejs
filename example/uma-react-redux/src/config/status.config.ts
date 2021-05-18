import { IContext } from '@umajs/core';

/* eslint-disable no-underscore-dangle */
export default {
    _404(ctx: IContext) {
        return ctx.render('404.html');
    },
    _error(e: Error, ctx: IContext) {
        console.log(e);

        return ctx.send('500 ERROR');
    },
};
