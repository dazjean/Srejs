module.exports = (configureWebpack, type) => {
    if (type == 'ssr') {
        //服务端渲染配置
    } else if (type === 'csr') {
        //客户端构建配置
        // configureWebpack.module.rules[0].exclude = /\/node_module\/!(antd.*)/;
    }

    return configureWebpack;
};
