<template>
  <div class="about">
     {{ message }}
      <p>{{about}}</p>
  </div>
</template>

<script>
  export default {
    name: 'about',
    props: ['about'],
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
