<template>
  <div id ='home'>
    <h1>{{title}}</h1>
    <router-link to="/" title="home">Home</router-link>|
    <router-link to="/about" title="about">About</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    props:['title'],
    data () {
		return {
			'message' : '首页'
		}
    },
  }
</script>