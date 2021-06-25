import App from './App.vue';
import Vue from 'vue';
export function createApp() {
    const app = new Vue({
        render: (h) => h(App)
    });
    return { app };
}
