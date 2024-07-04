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

const onMouseOver = (item) => {
    let sign = item.signs[0];
    hoveredATFSigns.value.push(new ATFSignSelector(sign.partName, sign.lineNumber, sign.signNumber,clickLevel.value))//select
}

const onMouseLeave = (item) => {
    hoveredATFSigns.value.splice(0, hoveredATFSigns.value.length);
}

const clickLevel = ref('sign');

const atf = ref('');

fetch('/data/O_219.atf')
    .then(response => response.text())
    //.then(data => atf.value = data)
    .then(data => atf.value = "@tablet\r\n@obverse\r\n1. 1(u)# 1(asz)# IKU A.SZA3 {gisz}KIRI6\r\n2. DA A.SZA3 la-la-ti-ia\r\n3. u3 DA na-ra-am-tum \r\n4. SAG.<BI>.1(disz).KAM hu-nu-nu-um \r\n5. [\u2026] SAG.<BI>.2(disz).KAM nu-ur2-be-el-ti-ni \r\n6.  SZAM2.TIL.LA.BI.SZE3 \r\n7. 1(u) GIN2 KU3.BABBAR \r\n8. IN.NA.LA2 \r\n9. KI ur-{gisz}GIGIR \r\n10. la-la-ti-ia \r\n11. IN.SZI.SA10 \r\n12. U4#.KUR2#.SZE3 INIM NU.GA2.GA2.A\r\n@reverse\r\n1. MU {d}LUGAL-MAR2.DA \r\n2. u3 su-mu-nu-um-hi-im \r\n3. IN.PA3.DE3.ESZ \r\n4. IGI sza?-bi-gi4-ri-is DUMU mil-{d}EN.ZU \r\n5. IGI na-bi-{d}EN.ZU DUMU be-la-nu-um \r\n6. IGI ku3-{d}NIN.SZUBUR DUMU DINGIR-ba-ni \r\n7. IGI {d}EN.ZU-li-di-isz DUMU DINGIR-ba-ni \r\n8. IGI nu-ur2-be-el-ti-ni SZESZ.A.NI \r\n9. IGI ib-ni-ir3-ra DUMU i3-li2-ba-asz-;ur?-la-ku \r\n10. IGI a-hu-szi-na DUMU {d}EN.ZU/LIL2-GAL?.ZU? \r\n11. IGI ar-wi-um DUB.SAR \r\n12. IGI na-bi-i3-li2-szu DUMU i3-li2-ba-asz;-ur?-la-ku \r\n13. ITI# APIN#.DU8?.A\r\n@top\r\n1. [MU {gisz}]GU#.ZA BARA2? {d}NIN.[...];-RE \r\n2. MU#.NA.DIM2\r\n@seal 1\r\n1. ur-{gisz}GIGIR \r\n2. DUMU x dul/ku4/tu");


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
