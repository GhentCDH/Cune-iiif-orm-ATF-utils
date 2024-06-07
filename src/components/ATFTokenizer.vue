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
                        <div class="gutter" :class="{ highlight: line in highlighted }">{{ line.lineNumber }}.</div>
                        <div class="line-text">
                            <span v-for="word in line.words">
                                <span class="word">
                                    <span v-for="(sign, index) in word.signs">
                                    {{ sign.prefix }}<span  
                                    v-on:mouseleave="(event) => onDeselect(event,sign)" 
                                    v-on:mouseover="(event) => onSelect(event,sign)" class="sign">{{ sign.text }}</span>{{ sign.suffix }}</span>
                                </span>
                                &nbsp;
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
import {ATFTokenizer} from '../lib/atf_tokenizer.ts';

const props = defineProps({
    selected: { type: Array, required: true }
});

const emit = defineEmits({
  selected: (sign) => {
    // return `true` or `false` to indicate
    // validation pass / fail
    return true;
  },
  deselected: (sign) => {
    // return `true` or `false` to indicate
    // validation pass / fail
    return true;
  }
})

const atf = ref('');

// event called when sign is hovered
const onSelect = (event,sign) => {
    emit('selected', sign);
}

const onDeselect = (event,sign) => {
    emit('deselected', sign);
}

const highlighted = (signs) => {
    console.log("highlight",signs);
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
    color: gray;
    user-select: none;
}

.sign{
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;

    border-bottom: 1px solid #F6F6F6;
    border-right: 1px solid #F6F6F6;
}

.word {
    border-bottom: 1px solid black;
    margin-bottom: 0.3rem;
    padding-bottom: 0.3rem;
    border-radius: 0.3rem;
    display: inline-block
}

.word:hover {
    border-bottom: 1px solid red;
}

.highlight {
    background-color: yellow;
}

.sign:hover {
    background-color: #A6A6A6;
    border-bottom: 1px solid green;
    border-right: 1px solid green;
    z-index: 99;
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