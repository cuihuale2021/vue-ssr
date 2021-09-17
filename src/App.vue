<template>
  <div id="app">
      <h1> {{ msg }}</h1>
      <p>
          <input type="text" v-model="msg"/>
      </p>
      <button @click="onClick">点击</button>
  </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return {
            msg: 'lagou'
        }
    },
    methods: {
        onClick(){
            console.log('lagou ~')
        }
    }
}
</script>

<style>

</style>