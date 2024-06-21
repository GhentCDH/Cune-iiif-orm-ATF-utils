<script setup lang="ts">
import ATFTokenizer from './components/ATFTokenizer.vue';
import type {ATFElement} from './types/CuniformTypes';

import { ref } from 'vue';

const selectedATFElements = ref<Set<ATFElement>>(new Set([]));

const hoveredATFElements = ref<Set<ATFElement>>(new Set([]));

const onSelect = (element: ATFElement) => {
    selectedATFElements.value.add(element);
}

const onDeselect = (element: ATFElement) => {
    selectedATFElements.value.delete(element);
}

const onClick = (element: ATFElement) => {
    console.log(element);
    if (selectedATFElements.value.has(element)) {
        onDeselect(element);
    } else {
        onSelect(element);
    }
}

const onMouseOver = (element: ATFElement) => {
    hoveredATFElements.value.add(element);
}

const onMouseLeave = (element: ATFElement) => {
    hoveredATFElements.value.delete(element);
}

const clickLevel = ref('sign');

const atf = ref('');

fetch('/data/O_219.atf')
    .then(response => response.text())
    .then(data => atf.value = data);

const namedEntities = ref([]);
    fetch('/data/named_entities.json')
    .then(response => response.text())
    .then(data => namedEntities.value = JSON.parse(data));
</script>

<template>
    <main>
        <div id="atf_demo">
            <h3>ATF</h3>
            <h3>Highlighted</h3>
            <textarea v-model="atf"></textarea>
            <div>
                <div style="float: right;">
                    <b>Level: </b>
                    <select  v-model="clickLevel">
                    <option value="sign">Sign</option>
                    <option value="word">Word</option>
                    <option value="line">Line</option>
                </select>
                </div>
                
                <ATFTokenizer 
                    :atf="atf"
                    :hovered="hoveredATFElements" 
                    :selected="selectedATFElements" 
                    @click="onClick"
                    :level="clickLevel"
                    @mouseleave="onMouseLeave" 
                    @mouseover="onMouseOver"  />
            </div>
        </div>
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
