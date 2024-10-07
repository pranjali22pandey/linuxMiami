<!-- Home-page Component -->

<template>
  <div id="hello-world">
    Hello ! {{ user }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: String,
});

const user = computed(() => {
  return props.userName || 'Guest';
});
</script>

<style lang="scss">
@import 'node_modules/@infineon/design-system-tokens/dist/tokens.scss';

#hello-world {
  font-size: 100px;
  margin-top: 20px;
  background: $ifxColorEngineering200;
  color: $ifxColorBerry500;
  padding: 100px;
  font-weight: lighter;
}
</style>
