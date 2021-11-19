import Koa from 'koa';
import srejs from '@srejs/vue3';

const app = new Koa();
const Sre = new srejs(app, process.env.NODE_ENV != 'production', false, { version: '3' });
app.use(async (ctx, next) => {
    if (ctx.path === '/vue' || ctx.path === '/') {
        const html = await Sre.render(
            ctx,
            'vue',
            {
                title: 'vue ssr',
                keywords: 'srejs vue ssr',
                description: '简单好用的服务端渲染引擎工具！',
                state: {
                    msg: 'vuex state',
                    say: 'vuex 你好 vue ssr!'
                }
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
                title: 'Vue-Router',
                keywords: 'srejs vue ssr',
                description: '简单好用的服务端渲染引擎工具！',
                home: '这是home页',
                about: '这是about页'
            },
            { ssr: true }
        );
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path.startsWith('/vuex')) {
        const html = await Sre.render(
            ctx,
            'vuex',
            {
                title: '简单的计数器',
                keywords: 'vuessr vuex server',
                description: '简单的计数器 server',
                message: '这是来自服务端初始化数据',
                state: {
                    count: 200
                }
            },
            { ssr: true }
        );
        ctx.type = 'text/html';
        ctx.body = html;
    } else {
        await next();
        ctx.type = 'text/html';
        ctx.body = '404 not found';
    }
});
app.listen(8001);
console.log('8001端口启动成功！');
