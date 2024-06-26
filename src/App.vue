<script setup lang="ts">
import ATFTokenizer from './components/ATFTokenizer.vue';
import type {ATFElement} from './types/CuniformTypes';

import {  ref,watch } from 'vue';

const selectedATFElements = ref<Set<ATFElement>>(new Set([]));

const hoveredATFElements = ref<Set<ATFElement>>(new Set([]));

const allATFElements = ref<ATFElement[]>(new Array<ATFElement>());

const onSelect = (element: ATFElement) => {
    console.log("onSelect",element);
    selectedATFElements.value.add(element);
}

const onDeselect = (element: ATFElement) => {
    console.log("onDeselect",element);
    selectedATFElements.value.delete(element);
}

const onClick = (element: ATFElement) => {
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
const onTokenized = (elements: Array<ATFElement>) => {
    allATFElements.value = elements;
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

watch(allATFElements, (newValue, oldValue) => {

    // Code to execute when allElements changes
    const selectByIndex = [[1,1],[2,2,2],[3,1,2,2]];

    for (let i = 0; i < newValue.length; i++) {
    const atfElement = newValue[i] as ATFElement;
    for (let j = 0; j < selectByIndex.length; j++) {
            const selector = selectByIndex[j];
            if(selector.length != atfElement.selector.length) continue;
            console.log("selector",selector,"atfElement",atfElement.selector);
            let match = true;
            for(let k = 0 ; k < Math.min(selector.length) && match  ; k++){
                if(atfElement.selector[k] != selector[k]){
                    match = false;
                    break;
                }
        }
        if(match){
            onSelect(atfElement);
            break;
        }
        }
    }
});

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
                    :entities="namedEntities"
                    
                    :level="clickLevel"

                    @tokenized="onTokenized"
                    @click="onClick"
                    @mouseleave="onMouseLeave" 
                    @mouseover="onMouseOver"  />

            </div>
        </div>
    </main>
</template>

<style>

.atf_part{
    margin-bottom: 1rem;
}

</style>

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
