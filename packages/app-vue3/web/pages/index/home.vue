<template>
  <div class="home">
      {{ message }}
      <p>{{home}}</p>
      <a v-on:click="goAbout">跳转子页面</a>
  </div>
</template>

<script>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  export default {
    name: 'home',
    props:['home'],
    setup(){
        const message = reactive('Home child router')
        const router = useRouter();
        const goAbout = ()=>{
          router.push('/about')
        }
        return {
          message,
          goAbout
        }
    }
  }
</script>
<style lang="less" scoped>
  .home{
    color: red;
  }
</style>