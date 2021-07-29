# 使用Vuex
> 当项目比较复杂时，我们可以在页面组件入口文件中导出Vuex store对象。框架会自动从根页面组件注入vue子组件中，通过$store访问到实例化后的store。

```js
import App from './App.vue';
export default {
    App,
    Store: {
        state: {
            count: 100,
        },
        mutations: {
            increment: (state) => state.count++,
            decrement: (state) => state.count--,
        },
    },
};
```
框架接收到Store对象后，会实例化vuex。并且初始化到vue实例中,通过vue.use注入到全局。对于初始化的state数据，如果在initProps中也传入同名的属性，则initProps.state将会覆盖主入口文件传入store.state中的属性值。

## 服务端初始化state
```js
Sre.render(ctx,'vuex',{state:{count:200}});
```

## 页面组件获取状态
```vue
<template>
  <div id = "app">
      <p>{{ count }}</p>
      <p>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
      </p>
  </div>
</template>

<script>
  export default {
    name: 'vuex',
    computed: {
      count () {
        return this.$store.state.count
      }
    },
    methods: {
      increment () {
        this.$store.commit('increment')
      },
      decrement () {
        this.$store.commit('decrement')
      }
    }
  }
</script>
```
最后展示到页面上的`count`初始值为：`200`