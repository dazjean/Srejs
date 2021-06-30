import App from './App.vue';
import Vue from 'vue';
import Router from 'vue-router';
import About from './about.vue';
import Home from './home.vue';

Vue.use(Router);

// route-level code splitting
// const About = () => import('./about.vue');
// const Home = () => import('./home.vue');

export function createRouter() {
    return new Router({
        mode: 'history',
        fallback: false,
        base: '/index/',
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            { path: '/about', component: About },
            { path: '/home', component: Home },
            { path: '/', redirect: '/home' }
        ]
    });
}
// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
    const router = createRouter();
    const app = new Vue({
        router,
        render: (h) => h(App)
    });
    return { app, router };
}
