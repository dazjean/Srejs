# 数据获取
> 在`Pages`页面中，vue页面组件获取数据有两种形式；我们分为服务端直出数据(Props和State)和vue组件静态方法`asyncData`获取两种形式。我们可以通过这两种方式对服务端渲染时首次页面渲染进行数据填充，使得服务端渲染时能返回完整的DOM结构，提高用户体验和更利于`SEO`.

## 服务端直出Props
> 框架在服务端提供了页面组件的渲染函数`render`,在调用函数渲染时我们可以在initProps参数中传递初始化的数据对象；这些数据可以在创建vue实例时会注册为组件实例的Props参数。在页面组件中我们可以将其定义为Props。 [了解vue组件Props](https://cn.vuejs.org/v2/guide/components-props.html)

```js
Sre.render(ctx,'list',{title:'xxx',keywords:'xxx',description:'xxxx','say':"hi!"});
```

在页面组件中我们可以直接通过Props将服务端直出的数据在vue模板中使用。
```vue
<template>
 <!--vue2.0版本APP.vue必须要设置根元素-->
  <div id ='app'>
    <h1>{{title}}</h1>
    <p>{{say}}</p>
  </div>
</template>

<script>
  export default {
    name: 'app',
    props:["say","title"]
  }
</script>
```

**特别说明：**在`initProps`参数中，`title,keywords,description`还会默认被解析为web网页头中的 标题，关键字，描述填充。

## 服务端初直出State
> 在initProps对象中，框架会默认将State属性初始化为store实例。从根组件“注入”到每一个子组件中。
```js
Sre.render(ctx,'list',{title:'xxx',keywords:'xxx',description:'xxxx',state:{
    'say':"hi!"
}});
```

我们可以直接在 `Vue` 任意组件中直接获得 `Vuex` 状态。获取方式为`this.$store.state`。
```vue
<template>
 <!--vue2.0版本APP.vue必须要设置根元素-->
  <div id ='app'>
    <h1>{{title}}</h1>
    <p>{{say}}</p>
  </div>
</template>

<script>
  export default {
    name: 'app',
    props:["title"],
    data:()=>{
        return {
            say:this.$store.state.say
        }
    }
  }
</script>
```
由于 Vuex 的状态存储是响应式的，从 store 实例中可以在计算属性中返回某个状态。
```vue
<script>
  export default {
    name: 'app',
    props:["title"],
    computed: {
        say () {
            return this.$store.state.say
        }
    }
  }
</script>
```
**更多获取Vuex状态的使用方法可查看官方文档[Vuex](https://vuex.vuejs.org/zh/guide/state.html)**

## asyncData
> `asyncData`是页面组件数据获取的钩子，`只能作用于页面`。其接收对象参数默认是`vuex`的`store`和当前`router`,通过`router`可以获取到当前路由的参数等数据，然后调用异步请求获取http类型的数据，然后通过`store`触发状态管理的更新,也可直接改写操作`store.state`属性。框架会合并到`store`数据上下文`state`中。
```vue
<script>
export default {
    name: 'app',
    data() {
        return {
            msg: this.$store.state.msg,
        };
    },
    async asyncData({ store, route }) {
      // store.state.msg = 'about来自asyncData的数据'
      // 触发 action 后，会返回 Promise
      return store.dispatch('fetchItem', route.params.id)
    },
};
</script>
```
**asyncData**灵感来自官方[vue-ssr示例](https://ssr.vuejs.org/zh/guide/data.html#%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96%E5%AD%98%E5%82%A8%E5%AE%B9%E5%99%A8-data-store)和[nuxtjs](https://zh.nuxtjs.org/docs/2.x/features/data-fetching#async-data)。