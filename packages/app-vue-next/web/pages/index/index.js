import { createMemoryHistory, createWebHistory } from 'vue-router';
import App from './App.vue';
import About from './about.vue';
import Home from './home.vue';

// route-level code splitting
// const About = () => import('./about.vue');
// const Home = () => import('./home.vue');

const isServer = typeof window === 'undefined';

const createHistory = isServer ? createMemoryHistory : createWebHistory;

export default {
    App,
    Router: {
        history: createHistory('/index/'),
        routes: [
            { path: '/about', props: true, component: About },
            { path: '/home', props: true, component: Home },
            { path: '/', redirect: '/home' }
        ]
    }
};
