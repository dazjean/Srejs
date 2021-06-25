<template>
  <div class="about">
     {{ message }}
  </div>
</template>

<script>
  export default {
    name: 'about',
    data () {
		return {
			'message' : 'about'
		}
    },
  }
</script>

<style lang="less" scoped>
  .about{
    color: red;
  }
</style>
