<script setup lang="ts">
import ATFTokenizer from './components/ATFTokenizer.vue';

import { ref } from 'vue';

const selected = ref([]);

const onSelect = (sign) => {
    console.log('selected',sign);
    selected.value.push(sign);
}

const onDeselect = (sign) => {
    console.log('deselected',sign);
    //filter not working for some reason
    selected.value = selected.value.filter((s) => s == sign);
}

const atf = ref('');

fetch('/data/O_219.atf')
    .then(response => response.text())
    .then(data => atf.value = data);

</script>

<template>
  <main>
    <div id="atf_demo">

      <h3>ATF</h3>
      <h3>highlighted</h3>

      <textarea v-model="atf"></textarea>

      <ATFTokenizer :atf="atf" :selected="selected" @selected="onSelect"  @deselected="onDeselect" />
    
    </div>
    <pre>{{ selected }}</pre>
  </main>
</template>

<style scoped>
#atf_demo {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}

pre {
    height: 30vh;
}
textarea {
    width: 100%;
    height: 70vh;
}

</style>
