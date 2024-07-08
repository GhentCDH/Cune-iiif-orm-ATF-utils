<template>

<div>
    <div v-for="(part, part_index) in tablet.parts" 
    :key="part_index" 
    :class="cssClassForElement(part)"
    v-on:click="() => emitClick(part)"
    v-on:mouseleave="() => emitMouseLeave(part)" 
    v-on:mouseenter="() => emitMouseEnter(part)" >
        <b>{{ part.text }}</b>
        <div v-for="(line, line_index) in part.lines" :key="line_index"
            :class="cssClassForElement(line)" 
            v-on:click="() => emitClick(line)"
            v-on:mouseleave="() => emitMouseLeave(line)" 
            v-on:mouseenter="() => emitMouseEnter(line)" >
        
            <div class="atf_line_gutter">{{ line.lineNumber }}.</div>
            
            <div class="atf_line_text">
                <span v-for="(word,word_index) in line.words" :key="word_index">
                    <span 
                        :class="cssClassForElement(word)"  
                        :title="titleForElement(word)" 
                        v-on:click="() => emitClick(word)"
                        v-on:mouseleave="() => emitMouseLeave(word)" 
                        v-on:mouseenter="() => emitMouseEnter(word)" >
                            <span  v-for="(sign, sign_index) in word.signs" :key="sign_index">
                            {{ sign.prefix }}<span
                            v-on:click="() => emitClick(sign)" 
                            v-on:mouseleave="() => emitMouseLeave(sign)" 
                            v-on:mouseenter="() => emitMouseEnter(sign)" 
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
import ATFTokenizer from '../lib/ATFTokenizer';
import ATFSignSelector from '../lib/ATFSignSelector';

import {ATFElement, ATFNamedEntity} from '@/types/';

const props = defineProps({

    /**
     * The `atf` prop represents the ATF (Akkadian Text Format) string that needs to be tokenized.
     * 
     * @type {String}
     * @required
     */
    atf: { type: String, required: true },

    hoveredSignSelectors: { type: Array, required: false, default: new Array<ATFSignSelector>([])},

    activeSignSelectors: { type: Array, required: false, default: new Array<ATFSignSelector>([])},
    
    entities: { type: Array, required: false, default: []},

    /**
     * The level prop specifies the level of selection or hovering: sign, word, line or part.
     * 
     * @type {String}
     * @default 'sign'
     * @required false
     */
    level: { type: String , required: false, default: 'sign'}
});

const elementToItem = (element) : ATFItem => {
    let item: ATFItem = null;
    if(element.type=='line') 
        item = ATFTokenizer.flattenLine(element);
    else if(element.type=='word')
        item = ATFTokenizer.flattenWord(element);
    else if(element.type=='sign')
        item = ATFTokenizer.flattenSign(element);
    else if(element.type=='part')
        item = ATFTokenizer.flattenPart(element);
    return item;
};


const emitClick = (element) => {
    if(element.type === props.level){
        let item: ATFItem = elementToItem(element);
        emit('click', item);
    }
};

const emitMouseEnter = (element) => {
    if(element.type === props.level){
        console.log('Mouse enter: ', element.type, element.text,props.level)
        let item: ATFItem = elementToItem(element);
        emit('mouseenter', item);
    }
}

const emitMouseLeave = (element) => {
    if(element.type === props.level){
        let item: ATFItem = elementToItem(element);
        emit('mouseleave', item);
    }
}

/**
 * Returns the CSS class for the given ATF element.
 * @param {ATFElement} element - The ATF element to get the CSS class for.
 * @returns {string} - The CSS class for the element.
 */
const cssClassForElement = (element: ATFElement) : string => {
    
    let item: ATFItem = elementToItem(element);
    let cssClass = 'atf_' + item.type;

    if(selectorSelectsItem(props.activeSignSelectors,item))  cssClass = cssClass + ' atf_active';
    if(selectorSelectsItem(props.hoveredSignSelectors,item)) cssClass = cssClass + ' atf_hovered';
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
  (event: 'mouseleave', payload: ATFItem): void;
  (event: 'mouseenter' , payload: ATFItem): void;
  (event: 'click'     , payload: ATFItem): void;
  (event: 'tokenized' , payload: Array<ATFItem>): void;
}>();


const selectorSelectsItem = (selectors: Array<ATFSignSelector>, item: ATFItem) : boolean => {
    // todo: item.signs can be empty. why?
    if (!item || !item?.signs?.length) return false;

    const sign = item.signs[0];

    let signIndex = -1;
    if(item.type === 'part') 
        signIndex = selectors.findIndex( (s) => s.partName === sign.partName && s.lineNumber === undefined && s.signNumber === undefined && s.wordNumber === undefined);
    else if(item.type === 'line')
        signIndex = selectors.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === undefined && s.wordNumber === undefined);
    else if(item.type === 'word')
        signIndex = selectors.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === undefined && s.wordNumber === sign.wordNumber);
    else if(item.type === 'sign')
        signIndex = selectors.findIndex( (s) => s.partName === sign.partName && s.lineNumber === sign.lineNumber && s.signNumber === sign.signNumber);
    
    return signIndex != -1;
}

const isNamedEntity = (element: ATFElement) : boolean => {
    return namedEntitiesMap.value.has(element.text);
}

const namedEntitiesMap = computed(() : Map<string,ATFNamedEntity> => {
    const map = new Map<string,ATFNamedEntity>();
    for (const entity of props.entities) {
        const namedEntity = entity as ATFNamedEntity;
        map.set(namedEntity.atf_form, namedEntity);
    }
    return map;
});

const atf = toRef(props, 'atf')


const tablet = computed(() => {

    const tokenizer = new ATFTokenizer();
    const tabletElement = tokenizer.tokenize(props.atf);

    const items =  ATFTokenizer.flatten(tabletElement);
    //console.log('Extracted number of atf items: ', items.length);
    emit('tokenized', items);

    return tabletElement;
});



</script>

<style>
b {
    font-weight: bold;
}

h3 {
    margin: 0;
    padding: 0;
}

.atf_part{
    border-radius: 0.4rem;
    border-left: 1px solid transparent;
}

.atf_line{
    display: grid;
    grid-template-columns: 2rem auto;
    padding: 0.2rem;
    border-radius: 0.4rem;
    border-bottom: 1px solid transparent;
}

.atf_line_gutter {
    color: gray;
    user-select: none;
}

.atf_named_entity {
    border-bottom: 1px solid  rgb(172, 87, 0);
    color: rgb(172, 87, 0);
    cursor:help;
}

.atf_sign{
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;
    border-bottom: 1px solid transparent;
}

.atf_word {
    border-bottom: 1px solid transparent;
    margin-bottom: 0.3rem;
    padding-bottom: 0.3rem;
    border-radius: 0.3rem;
    display: inline-block
}

.atf_hovered {
    border-bottom: 1px solid rgb(42, 96, 44);
    background-color: rgb(212, 236, 213) !important;
    color: rgb(42, 96, 44);
}

.atf_part.atf_hovered{
    border-left: 1px solid  rgb(42, 96, 44) !important;
    border-bottom: none !important;
}

.atf_active{
    color:  rgb(42, 96, 44);
    border-color:  rgb(42, 96, 44);
    background-color: rgb(234, 246, 234);
}
</style>