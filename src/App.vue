<script setup lang="ts">
import ATFTokenizer from './components/ATFTokenizer.vue';
import {type ATFElement } from './types/CuniformTypes';

import { ref } from 'vue';

const selectedATFElements = ref<ATFElement[]>([]);

const onSelect = (element: ATFElement) => {
    console.log('selected app',element);
    selectedATFElements.value.push(element);
}

const onDeselect = (element: ATFElement) => {
    console.log('deselecte app',element);
    let index = selectedATFElements.value.indexOf(element);
    selectedATFElements.value.splice(index,1);//  = selectedATFElements.value.filter((s: ATFElement) => s.characterPosition != element.characterPosition);
}

const atf = ref('');

fetch('/data/O_219.atf')
    .then(response => response.text())
    .then(data => atf.value = data);

const namedEntities = ref([]);
    fetch('/data/name_entities.json')
    .then(response => response.text())
    .then(data => namedEntities.value = JSON.parse(data));

</script>

<template>
  <main>
    <div id="atf_demo">

      <h3>ATF</h3>
      <h3>highlighted</h3>

      <textarea v-model="atf"></textarea>

      <ATFTokenizer :atf="atf" :selected="selectedATFElements" @selected="onSelect"  @deselected="onDeselect" />
    
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
