<script setup lang="ts">
import ATFTokenizer from './components/ATFTokenizer.vue';

import { ref,watch } from 'vue';

const selected = ref([]);

const onSelect = (sign) => {
    console.log('selected',sign);
    selected.value.push(sign);
}

const onDeselect = (sign) => {
    console.log('deselected',sign);
    selected.value = selected.value.filter((s) => s != sign);
}

</script>

<template>
  <main>
    <ATFTokenizer @selected="onSelect"  @deselected="onDeselect" :selected="selected" />

    <pre>{{ selected }}</pre>
  </main>
</template>

<style scoped>

</style>
