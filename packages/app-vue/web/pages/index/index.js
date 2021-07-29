import App from './App.vue';
import About from './about.vue';
import Home from './home.vue';

// route-level code splitting
// const About = () => import('./about.vue');
// const Home = () => import('./home.vue');

export default {
    App,
    Router: {
        mode: 'history',
        fallback: false,
        base: '/index/',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/about', props: true, component: About },
            { path: '/home', props: true, component: Home },
            { path: '/', redirect: '/home' }
        ]
    }
};
