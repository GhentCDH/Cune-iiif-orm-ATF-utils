<template>

<div>
    <div v-for="(part, part_index) in tokenized.parts" :key="part_index" :class="cssClassForElement(part)">
        <b>{{ part.id }}</b>
        <div v-for="(line, line_index) in part.lines" :key="line_index"
            :class="cssClassForElement(line)" 
            v-on:click="() => {if( level == 'line') { emit('click', line) }}"
            v-on:mouseleave="() => {if( level == 'line') {  emit('mouseleave', line)}}" 
            v-on:mouseover="() => {if( level == 'line') {  emit('mouseover', line)}}" >   
        
                <div class="atf_line_gutter">{{ line.lineNumber }}.</div>
            
                <div class="atf_line_text">
                    <span v-for="(word,word_index) in line.words" :key="word_index">
                        <span :class="cssClassForElement(word)"  :title="titleForElement(word)" 
                        v-on:click="() => {if(level == 'word') { emit('click', word) }}"
                        v-on:mouseleave="() => {if(level == 'word') {  emit('mouseleave', word) }}" 
                        v-on:mouseover="() =>{if(level == 'word') {  emit('mouseover', word) }}" >
                            <span  v-for="(sign, sign_index) in word.signs" :key="sign_index">
                            {{ sign.prefix }}<span
                            v-on:click="() => {if(level == 'sign') { emit('click', sign) }}" 
                            v-on:mouseleave="() => {if(level == 'sign') { emit('mouseleave', sign) }}" 
                            v-on:mouseover="() => {if(level == 'sign') { emit('mouseover', sign)  }}" 
                            :class="cssClassForElement(sign)">{{ sign.text }}</span>{{ sign.suffix }}</span>
                        </span>
                        &nbsp;
                    </span>
                </div>   
        </div>
    </div>
</div>

</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import ATFTokenizer from '../lib/atf_tokenizer';

import type {ATFElement, ATFNamedEntity} from '@/types/';

const props = defineProps({

    /**
     * The `atf` prop represents the ATF (Akkadian Text Format) string that needs to be tokenized.
     * 
     * @type {String}
     * @required
     */
    atf: { type: String, required: true },

    hovered: { type: Set, required: false, default: new Set([])},

    selected: { type: Set, required: false, default: new Set([])},

    entities: { type: Array, required: false, default: []},


    /**
     * The level prop specifies the level of selection or hovering: .
     * 
     * @type {String}
     * @default 'sign'
     * @required false
     */
    level: { type: String, required: false, default: 'sign'}
});

/**
 * Returns the CSS class for the given ATF element.
 * @param {ATFElement} element - The ATF element to get the CSS class for.
 * @returns {string} - The CSS class for the element.
 */
const cssClassForElement = (element: ATFElement) : string => {
    let cssClass = element.cssClass;
    if(isMouseOver(element)) cssClass = cssClass + ' atf_hovered';
    if(isSelected(element))  cssClass = cssClass + ' atf_selected';
    if(isNamedEntity(element))  cssClass = cssClass + ' atf_named_entity';

    return cssClass;
}

const titleForElement = (element: ATFElement) : string => {
    let title = "";
    if (isNamedEntity(element)) {
        const namedEntity = namedEntitiesMap.value.get(element.text) as ATFNamedEntity;
        title =  namedEntity.name + " (" + namedEntity.type + ")";
    }
    return title;
}

const emit = defineEmits<{
  (event: 'mouseleave', payload: ATFElement): void;
  (event: 'mouseover' , payload: ATFElement): void;
  (event: 'click'     , payload: ATFElement): void;
  (event: 'tokenized' , payload: Array<ATFElement>): void;
}>();

const isSelected = (element: ATFElement) : boolean => {
    return props.selected.has(element);
}
const isMouseOver = (element: ATFElement) : boolean => {
    return props.hovered.has(element);
}
const isNamedEntity = (element: ATFElement) : boolean => {
   return namedEntitiesMap.value.has(element.text);
}

const atf = toRef(props, 'atf')

const namedEntitiesMap = computed(() : Map<string,ATFNamedEntity> => {
    const map = new Map<string,ATFNamedEntity>();
    for (const entity of props.entities) {
        const namedEntity = entity as ATFNamedEntity;
        map.set(namedEntity.atf_form, namedEntity);
    }
    return map;
});

const tokenized = computed(() => {
    const tokenizer = new ATFTokenizer();
    const tokens = tokenizer.tokenize(props.atf);

    // Clear the elements array
    let elements = new Array<ATFElement>();

    // add all elements to the elements array
    for (const part of tokens.parts) {
        elements.push(part);
        for (const line of part.lines) {
            elements.push(line);
            for (const word of line.words) {
                elements.push(word);
                for (const sign of word.signs) {
                    elements.push(sign);
                }
            }
        }
    }

    emit('tokenized', elements) 

    return tokens;
});


</script>

<style scoped>
b {
    font-weight: bold;
}

h3 {
    margin: 0;
    padding: 0;
}
</style>

<style>
.atf_line{
    display: grid;
    grid-template-columns: 2rem auto;
    padding: 0.2rem;
    border-radius: 0.2rem;
}

.atf_line_gutter {
    color: gray;
    user-select: none;
}

.atf_named_entity {

    border-bottom: 1px solid  blue;
    color:  blue ;
    cursor:help;
}

.atf_sign{
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;

    border-bottom: 1px solid #F6F6F6;
    border-right: 1px solid #F6F6F6;
}

.atf_word {
    border-bottom: 1px solid transparent;
    margin-bottom: 0.3rem;
    padding-bottom: 0.3rem;
    border-radius: 0.3rem;
    display: inline-block
}

.atf_hovered {
    border-bottom: 1px solid red;
}

.atf_selected{
    color: green;
    background-color: beige;
}
</style>