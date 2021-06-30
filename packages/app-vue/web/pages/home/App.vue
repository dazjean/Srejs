<template>
  <div id = "app">
      <div class="home">
        {{ message }}
      </div>
      <p class="scoped">
        style scoped
      </p>
      <p class="less">
        style scoped lang=less
      </p>
      <p class="import-css">
        import  from './index.less';
      </p>
      <p :class="$style.red">
        style module
      </p>
       <p :class="styles.module">
        import styles from './index.module.less';
      </p>
  </div>
</template>

<script>
  import  './index.less';
  import styles from './index.module.less';
  export default {
    name: 'home',
    data () {
		return {
			'message' : 'hello word!!!',
      styles
		}
    },
  }
</script>
<style lang="stylus">
body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color lighten(#eceef1, 30%)
  margin 0
  padding-top 55px
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none

.header
  background-color #ff6600
  position fixed
  z-index 999
  height 55px
  top 0
  left 0
  right 0
  .inner
    max-width 800px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
  a
    color rgba(255, 255, 255, .8)
    line-height 24px
    transition color .15s ease
    display inline-block
    vertical-align middle
    font-weight 300
    letter-spacing .075em
    margin-right 1.8em
    &:hover
      color #fff
    &.router-link-active
      color #fff
      font-weight 400
    &:nth-child(6)
      margin-right 0
  .github
    color #fff
    font-size .9em
    margin 0
    float right

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle
#app
 text-align: center;
.home
  font-size 36px
  color red
.view
  max-width 800px
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 860px)
  .header .inner
    padding 15px 30px

@media (max-width 600px)
  .header
    .inner
      padding 15px
    a
      margin-right 1em
    .github
      display none
</style>
<style lang="less" scoped>
  .less{
    color: red;
    font-size: 36px;
  }
</style>

<style scoped>
.scoped {
  color: red;
  font-size: 36px;
}
</style>

<style  module>
.red {
  color: red;
  font-size: 36px;
}
.bold {
  font-weight: bold;
}
</style>
