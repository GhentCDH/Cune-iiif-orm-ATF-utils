# atf-cuniform-utilities

This contains TypeScript functions which help when working with [ATF](http://oracc.museum.upenn.edu/doc/help/editinginatf/), a semi-standardized text markup format used by the [Cuneiform Digital Library Initiative](https://cdli.ucla.edu) as a way to transcribe the contents of [cuniform](https://en.wikipedia.org/wiki/Cuneiform) tablets.

More specifically it contains a tokenizer to split ATF contents into separate characters. See [here](https://gitlab.com/fcgl/annotator-showcase/-/blame/main/js/annotatorfunctions.js?page=2#L1098) and [here](https://github.com/ElectronicBabylonianLiterature/ebl-frontend/tree/4644dee9118484aa675cd37c3b6230e015760d86/src/transliteration/domain) for similar projects.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```


## Credits

Developed at GhentCDH