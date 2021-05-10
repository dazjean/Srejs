import Koa from 'koa';
import srejs from '@srejs/react';
const app = new Koa();
const Sre = new srejs(app,process.env.NODE_ENV != 'production',false);
app.use(async (ctx,next)=>{
    if(ctx.path==="/"){
        const html = await Sre.render(ctx,'index',{title:'介绍'});
        ctx.type = 'text/html';
        ctx.body = html;
    }else if(ctx.path==="/list"){
       const html = await Sre.render(ctx,'list',{ListData:['item1','item2','item3','item4',]});
       ctx.type = 'text/html';
       ctx.body = html;
    }else if(ctx.path==="/less"){
        const html = await Sre.render(ctx,'less',{msg:'srejs!'});
        ctx.type = 'text/html';
        ctx.body = html;
    }else if(ctx.path==="/redux"){
        const html = await Sre.render(ctx,'redux',{count:100});
        ctx.type = 'text/html';
        ctx.body = html;
    }else if(ctx.path.startsWith('/router')){
        const html = await Sre.render(ctx,'router');
        ctx.type = 'text/html';
        ctx.body = html;
    }else{
        await next();
    }
})
app.listen(8001);
console.log('8001端口启动成功！')

