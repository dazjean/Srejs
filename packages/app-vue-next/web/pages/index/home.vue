<template>
  <div class="home">
     {{ message }}
      <p>{{home}}</p>
  </div>
</template>

<script>
  export default {
    name: 'home',
    props:['home'],
    data () {
		return {
			'message' : 'home'
		}
    },
  }
</script>
<style lang="less" scoped>
  .home{
    color: red;
  }
</style>