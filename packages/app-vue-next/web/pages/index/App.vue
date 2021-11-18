<template>
  <div class ='home'>
    <!-- <h1>{{title}}</h1>
    <router-link to="/home" title="home">Home</router-link>|
    <router-link to="/about" title="about">About</router-link>
    <router-view></router-view>
    {{message}} -->
     <h1>{{message}}</h1>
     <router-view></router-view>
  </div>
</template>

<script>
  import { reactive } from 'vue';
  export default {
    name: 'app',
    props:['title'],
    setup(){
      const message = reactive('Vue 3 Guide')
      return {
        message
      }
    }
  }
</script>

<style scoped>
  .home{
      text-align: center;
  }
</style>