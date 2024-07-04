<script setup lang="ts">
import ATFTokenizer from '@/components/ATFTokenizer.vue';
//import {ATFItemSign} from './types/CuniformTypes';
import ATFSignSelector from '@/lib/ATFSignSelector.ts';
import {ref } from 'vue';

const activeATFSigns = ref<Array<ATFSignSelector>>([]);

const hoveredATFSigns = ref<Array<ATFSignSelector>>([]);


const activateOrDeactivateSign = (sign) => {
    const signIndex = activeATFSigns.value.findIndex(
        (s) =>  s.partName === sign.partName && 
        s.lineNumber === sign.lineNumber && 
        s.signNumber === sign.signNumber &&
        s.type === clickLevel.value
    )
    if (signIndex == -1) {
        let selector = new ATFSignSelector(sign.partName, sign.lineNumber, sign.signNumber,clickLevel.value)
        activeATFSigns.value.push(selector)//select
    } else {
        activeATFSigns.value.splice(signIndex, 1)//deselect
    }
    console.log('APP: activeATFSigns', activeATFSigns.value.length);
}

const onClick = (item) => {
    console.log('APP: atf item click', item);
    activateOrDeactivateSign(item.signs[0]);
}

const toggleHovered = (sign) => {
    
}

const onMouseOver = (item) => {
    let sign = item.signs[0];
    hoveredATFSigns.value.push(new ATFSignSelector(sign.partName, sign.lineNumber, sign.signNumber,clickLevel.value))//select
}

const onMouseLeave = (item) => {
    hoveredATFSigns.value.splice(0, hoveredATFSigns.value.length);
    console.log('APP: hoveredATFSigns', hoveredATFSigns.value.length);
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
                        <option value="part">Part</option>
                    </select>
                </div>
                
                <ATFTokenizer 

                    :atf="atf"
                   
                    :entities="namedEntities"
                    
                    :level="clickLevel"
                    :activeSignSelectors="activeATFSigns"
                    :hoveredSignSelectors="hoveredATFSigns"

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
