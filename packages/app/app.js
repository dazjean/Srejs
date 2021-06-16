import Koa from 'koa';
import srejs from '@srejs/react';
const app = new Koa();
const Sre = new srejs(app, process.env.NODE_ENV != 'production', false, {});

const ListData = ['item0', 'item1', 'item2', 'item3'];

app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        const html = await Sre.render(ctx, 'index', { title: '介绍' }, { ssr: true });
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path === '/serverList') {
        const html = await Sre.render(ctx, 'list', {
            ListData
        });
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path === '/clientList') {
        const html = await Sre.render(
            ctx,
            'list',
            {
                ListData
            },
            { ssr: false }
        );
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path === '/modules') {
        const html = await Sre.render(ctx, 'modules', { msg: 'srejs!' });
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path === '/redux') {
        const html = await Sre.render(ctx, 'redux', { count: 100 });
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path.startsWith('/router')) {
        const html = await Sre.render(ctx, 'router');
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path.startsWith('/detail')) {
        const n = ctx.url.replace('/detail/', '');
        const html = await Sre.render(ctx, 'detail', { detail: { text: ListData[n || 0] } });
        ctx.type = 'text/html';
        ctx.body = html;
    } else if (ctx.path === '/antd') {
        const html = await Sre.render(ctx, 'ruleHistoryList');
        ctx.type = 'text/html';
        ctx.body = html;
    } else {
        await next();
    }
});
app.listen(8001);
console.log('8001端口启动成功！');
