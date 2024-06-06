<template>
    <div id="atf_demo">
        <h3>ATF</h3>
        <h3>Tokenized</h3>
        <textarea v-model="atf"></textarea>
        <textarea v-model="tokenized"></textarea>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ATFTokenizer from '../lib/atf_tokenizer.ts';

const atf = ref('');

const atf_content = fetch('/data/O_219.atf')
    .then(response => response.text())
    .then(data => atf.value = data);

const tokenized = computed(() => {
    const tokenizer = new ATFTokenizer();
    const tokens = tokenizer.tokenize(atf.value);
    return tokens.join('\n');
})

</script>

<style scoped>
#atf_demo {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 1rem;
}
textarea {
    width: 100%;
    height: 70vh;
}
h3 {
    margin: 0;
    padding: 0;
}
</style>