<script setup lang="ts">
import ATFTokenizer from '@/components/ATFTokenizer.vue';
//import {ATFItemSign} from './types/CuniformTypes';
import ATFSignSelector from '@/lib/ATFSignSelector.ts';
import {computed, ref } from 'vue';

const activeATFSigns = ref<Array<ATFSignSelector>>([]);

const hoveredATFSigns = ref<Array<ATFSignSelector>>([]);


const activateOrDeactivateItem = (item) => {
    
    let sign = item.signs[0];
    let signIndex = -1;
    if(item.type === 'part')
        signIndex = activeATFSigns.value.findIndex( (s) => s.partName === sign.partName && s.lineNumber === undefined && s.signNumber === undefined && s.wordNumber === undefined);
    else if(item.type === 'line')
        signIndex = activeATFSigns.value.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === undefined && s.wordNumber === undefined);
    else if(item.type === 'word')
        signIndex = activeATFSigns.value.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === undefined && s.wordNumber === sign.wordNumber);
    else if(item.type === 'sign')
        signIndex = activeATFSigns.value.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === sign.signNumber);

    if (signIndex == -1) {
        let selector = itemToSelector(item);
        activeATFSigns.value.push(selector)//select
    } else {
        activeATFSigns.value.splice(signIndex, 1)//deselect
    }

    console.log('APP: activeATFSigns', activeATFSigns.value.length,item);
}

const onClick = (item) => {
    console.log('APP: atf item click', item);
    activateOrDeactivateItem(item);
}

const itemToSelector = (item) => {
    let sign = item.signs[0];
    let selector = new ATFSignSelector(sign.partName, sign.lineNumber, sign.signNumber,sign.wordNumber)
    if(clickLevel.value == 'part')
        selector = new ATFSignSelector(sign.partName, undefined, undefined,undefined)
    else if(clickLevel.value == 'line')
        selector = new ATFSignSelector(sign.partName, sign.lineNumber, undefined,undefined)
    else if(clickLevel.value == 'word')
        selector = new ATFSignSelector(sign.partName, sign.lineNumber, undefined,sign.wordNumber)
    return selector;
}

const onMouseEnter = (item) => {
    hoveredATFSigns.value.push(itemToSelector(item));
    console.log('APP: mouse enter', item, hoveredATFSigns.value.length);
}

const onMouseLeave = (item) => {
    hoveredATFSigns.value.splice(0, hoveredATFSigns.value.length);
    console.log('APP: mouse leave', item, hoveredATFSigns.value.length);
}

const clickLevel = ref('sign');

const atf = computed(() => {
    return tablets.value.find((t) => t.id === tabletId.value)?.transliteration_atf
})
const tabletId = ref('null')
const tablets = ref([])

fetch('/data/tablets.json')
    .then(response => response.text())
    //.then(data => atf.value = data)
    .then(data => tablets.value = JSON.parse(data));


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
                        <option value="part">Part</option>
                    </select>
                    <select v-model="tabletId">
                        <option v-for="tablet of tablets" :value="tablet.id" :key="'tb-option' + tablet.id">{{ tablet.id }}</option>
                    </select>
                </div>
                
                <ATFTokenizer v-if="atf"

                    :atf="atf"
                   
                    :entities="namedEntities"
                    
                    :level="clickLevel"
                    :activeSignSelectors="activeATFSigns"
                    :hoveredSignSelectors="hoveredATFSigns"

                    @click="onClick"
                    @mouseleave="onMouseLeave" 
                    @mouseenter="onMouseEnter"  />

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
