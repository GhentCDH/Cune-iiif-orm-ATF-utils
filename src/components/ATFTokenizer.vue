<template>
    <div id="atf_demo">
        <h3>ATF</h3>
        <h3>highlighted</h3>

        <textarea v-model="atf"></textarea>

        <div>
            <span v-for="part in tokenized.parts">
            
                <b>{{ part.name }}</b>

                <div class="part" v-for="line in part.lines">
                    
                    <div class="line">
                        <span class="gutter">{{ line.lineNumber }}.</span>

                        <div style="signs">
                            <span v-for="sign in line.signs">
                                {{ sign.prefix }}<span  
                                v-on:mouseleave="(event) => onSignDeselect(event,sign)" 
                                v-on:mouseover="(event) => onSignSelect(event,sign)" class="sign">
                                    {{ sign.text }}
                                </span>{{ sign.suffix }}
                                
                            </span>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    </div>
<pre>{{ atf_json }}</pre>
</template>

<script setup>
import { ref, computed } from 'vue';
import {ATFTokenizer } from '../lib/atf_tokenizer.ts';

const atf = ref('');

// event called when sign is hovered
const onSignSelect = (event,sign) => {
    console.log("select",sign);
}

const onSignDeselect = (event,sign) => {
    console.log("deselect",sign);
}


fetch('/data/O_219.atf')
    .then(response => response.text())
    .then(data => atf.value = data);

const tokenized = computed(() => {
    const tokenizer = new ATFTokenizer();
    const tokens = tokenizer.tokenize(atf.value);
    return tokens;
});

const atf_json = computed(() => {
    const tokenizer = new ATFTokenizer();
    const tokens = tokenizer.tokenize(atf.value);
    return JSON.stringify(tokens, null, 2);
});

</script>

<style scoped>
#atf_demo {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}
textarea {
    width: 100%;
    height: 70vh;
}

.line{
    display: grid;
    grid-template-columns: 2rem auto;
    padding: 0.2rem;
    border-radius: 0.2rem;
}

.line:hover {
    
    background-color: #f3f3f3;
}

.gutter {
    color: gray
}

.sign{
    padding: 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;
}

.sign:hover {
    background-color: lightblue;
    border-bottom: 1px solid green;
}

b {
    display: block;
    font-weight: bold;
}

h3 {
    margin: 0;
    padding: 0;
}
</style>