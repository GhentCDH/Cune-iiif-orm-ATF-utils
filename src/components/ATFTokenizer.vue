<template>

<div>
    <div v-for="(part, part_index) in tokenized.parts" :key="part_index">
        <b>{{ part.name }}</b>
        <div class="part" v-for="(line, line_index) in part.lines" v-on:click="() => {if( clickLevel == 'line') { emit('click', line) }}"  :key="line_index">
            
            <div :class="isSelected(line) ? 'line selected' : 'line'" >
                <div class="gutter">{{ line.lineNumber }}.</div>
                <div class="line-text">
                    <span v-for="(word,word_index) in line.words" :key="word_index">
                        <span :class="isSelected(word) ? 'word selected' : 'word' "  v-on:click="() => {if(clickLevel == 'word') { emit('click', word) }}">
                            <span  v-for="(sign, sign_index) in word.signs" :key="sign_index">
                            {{ sign.prefix }}<span
                            v-on:click="() => {if(clickLevel == 'sign') { emit('click', sign) }}" 
                            v-on:mouseleave="() => emit('mouseleave', line)" 
                            v-on:mouseover="() => emit('mouseover', line)" 
                            :class="isSelected(sign) ? 'sign selected' : 'sign' ">{{ sign.text }}</span>{{ sign.suffix }}</span>
                        </span>
                        &nbsp;
                    </span>
                </div>
            </div>   
        </div>
    </div>
</div>

</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import ATFTokenizer from '../lib/atf_tokenizer';
import type { ATFElement } from '@/types/CuniformTypes';

const props = defineProps({
    selected: { type: Array, required: false, default: []},
    atf: { type: String, required: true },
    hovered: { type: Array, required: false, default: []},
    clickLevel: { type: String, required: false, default: 'word'}
});


const emit = defineEmits<{
  (event: 'mouseleave', payload: ATFElement): void;
  (event: 'mouseover' , payload: ATFElement): void;
  (event: 'click'     , payload: ATFElement): void;
}>();

const isSelected = (element: ATFElement) => {
    return props.selected.includes(element);
}

const atf = toRef(props, 'atf')

const tokenized = computed(() => {
    const tokenizer = new ATFTokenizer();
    const tokens = tokenizer.tokenize(atf.value);
    return tokens;
});

</script>

<style scoped>

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

.selected{
    color: green;
    background-color: beige;
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