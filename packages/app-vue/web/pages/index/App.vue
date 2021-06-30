<template>
  <div id ='app'>
    {{message}}
    <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
		return {
			'message' : '首页'
		}
    },
  }
</script>