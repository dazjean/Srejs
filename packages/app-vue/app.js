import Koa from 'koa';
import srejs from '@srejs/vue';
const app = new Koa();
const Sre = new srejs(app, process.env.NODE_ENV != 'production', false, {});
app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        const html = await Sre.render(
            ctx,
            'home',
            {
                title: '介绍',
                keywords: 'srejs vue ssr',
                description: '简单好用的服务端渲染引擎工具！'
            },
            { ssr: true }
        );
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path.startsWith('/index')) {
        const html = await Sre.render(
            ctx,
            'index',
            {
                title: '介绍',
                keywords: 'srejs vue ssr',
                description: '简单好用的服务端渲染引擎工具！'
            },
            { ssr: true }
        );
        ctx.type = 'text/html';
        ctx.body = html;
    } else {
        await next();
    }
});
app.listen(8001);
console.log('8001端口启动成功！');
