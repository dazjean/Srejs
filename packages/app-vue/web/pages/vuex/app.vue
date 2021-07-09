<template>
  <div id = "app">
      <h1>{{title}}</h1>
      <div class="vuex">
        {{ message }}
      </div>
      <p>{{ count }}</p>
      <p>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
      </p>
  </div>
</template>

<script>
  export default {
    name: 'vuex',
    props: ['message','title'],
    computed: {
      count () {
        return this.$store.state.count
      }
    },
    methods: {
      increment () {
        this.$store.commit('increment')
      },
      decrement () {
        this.$store.commit('decrement')
      }
    }
  }
</script>