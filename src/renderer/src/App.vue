<template>
  <div id="app">
    <TemplateLayout />
  </div>
</template>

<script setup>
import TemplateLayout from "./components/TemplateLayout.vue";
</script>

<style lang="scss">
@import 'node_modules/@infineon/design-system-tokens/dist/tokens.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: white;
  height: auto;
}
</style>
