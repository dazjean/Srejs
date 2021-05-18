export default {
    'react-ssr': {
        enable: true,
        options: {
            rootDir: 'web',
            ssr: true, // 全局开启服务端渲染
            cache: false, // 全局使用服务端渲染缓存 开发环境设置true无效
        },
    },
};
