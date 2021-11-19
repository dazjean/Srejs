// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);
// export function createStore() {
//     return new Vuex.Store();
// }

export const vuexStore = {
    state: {
        count: 100
    },
    mutations: {
        increment: (state) => state.count++,
        decrement: (state) => state.count--
    }
};
