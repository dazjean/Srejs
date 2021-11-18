<template>
  <div class="about">
     {{ message }}
      <p>{{about}}</p>
      <a @click="goback">返回home</a>
  </div>
</template>

<script>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  export default {
    name: 'about',
    props: ['about'],
    setup(){
      const message = reactive('About child router' );
       const router = useRouter();
        const goback = ()=>{
          router.back()
        }
      return {
        message,
        goback
      }
    }
  }
</script>

<style lang="less" scoped>
  .about{
    color: red;
  }
</style>
