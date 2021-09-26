#!/usr/bin/env node
var commander = require('commander');
commander
    .version('1.0.0')
    .option('-d, --dev [page]', '启动客户端渲染开发模式')
    .option('-b, --build [page]', '生成环境构建编译，输出目录默认dist/')
    .option('-a, --analyzer [page]', '编译构建打包分析');

const build = (page) => {
    const { build } = require('../lib/build');
    if (page == 'true') {
        process.env.NODE_ENV = 'production';
        page = JSON.parse(page);
    } else if (page == 'false') {
        process.env.NODE_ENV = 'development';
        page = JSON.parse(page);
    } else {
        process.env.NODE_ENV = 'production';
    }
    build(page);
};

// webpack build bundle
commander.command('build [page]').action((page = true) => {
    build(page);
});

// Analyzer webpack build bundle
commander.command('analyzer [page]').action((page = true) => {
    process.argv.push('--analyzer');
    build(page);
});

// start with webpack-dev-server with csr
commander.command('dev [page]').action((page = true) => {
    const { dev } = require('../lib/dev');
    process.env.NODE_ENV = 'development';
    dev(page);
});

commander.parse(process.argv);
