import Tokenizr from 'tokenizr';

// See https://build-oracc.museum.upenn.edu/doc/help/editinginatf/primer/structuretutorial/index.html
// for a description of the ATF format.

import type{ Line, Part, Sign,  Tablet,  Word } from '../types/CuniformTypes';

export class ATFTokenizer {
    private tokenizer: Tokenizr;

    constructor() {
        this.tokenizer = new Tokenizr();
        this.setupRules();
    }

    private setupRules() {

        //tablet part indication @obverse, @reverse, @edge
        // eslint-disable-next-line
        this.tokenizer.rule(/\@tablet/, (ctx, match) => {
            ctx.ignore();
        });

        //tablet part indication @obverse, @reverse, @edge
        // eslint-disable-next-line no-useless-escape
        this.tokenizer.rule(/(\@)(.+)/, (ctx, match) => {
            ctx.accept('tablet_part', match[2]);
        });
        
        //dollar line
        this.tokenizer.rule(/(\$) (.+)/, (ctx, match) => {
            ctx.accept('tablet_dollar_line', match[1]);
        });

        //tablet identifier, &
        this.tokenizer.rule(/(&)(.+?)(=>*)?/, (ctx, match) => {
            ctx.accept('tablet_identifier', match[0]);
        });

        //comment line
        this.tokenizer.rule(/\n ?# ?.*/, (ctx, match) => {
            ctx.accept('tablet_comment', match);    
        });

        //tablet line number
        this.tokenizer.rule(/[0-9]+\. /, (ctx, match) => {
            const remaineder = match.input.substring(match.index);
            const lineText = remaineder.substring(0,remaineder.indexOf('\n'));
            const lineNumber = parseInt(match[0]);
            ctx.accept('tablet_line_number', [lineNumber, lineText]);

            //starts the first word
            ctx.accept('tablet_word_separator', match[0]);
        });

        //tablet sign delimeted by {} e.g. KI ur-{gisz}GIGIR
        // eslint-disable-next-line
        this.tokenizer.rule(/\{?[0-9a-zA-Z\(\)]+#?\}?/, (ctx, match) => {
            ctx.accept('tablet_sign', match[0]);
        });

        //Word separators
        this.tokenizer.rule(/[ ;]+/, (ctx, match) => {
            ctx.accept('tablet_word_separator', match[2]);
        });

        //Sign separators
        // eslint-disable-next-line
        this.tokenizer.rule(/[.<>\-\[\]\?;\#/]+/, (ctx, match) => {
            ctx.accept('tablet_sign_separator', match[2]);
        });

        this.tokenizer.rule(/\r?\n/, (ctx, ) => {
            //ctx.accept('newline', match);
            ctx.ignore();
        });

        this.tokenizer.rule(/.+/, (ctx, match) => {
            console.log('Unmatched, unexpected text: ', match);
            ctx.accept('line', match);
        });
    }

    tokenize(atfString: string) {
        const tablet: Tablet = {
            parts: []
        };

        this.tokenizer.input(atfString);
        this.tokenizer.tokens().forEach((token) => {

            if (token.type === 'tablet_part') {
                const part = {
                    name: token.value,
                    lines: []
                } as Part;
                tablet.parts.push(part);
            } else if (token.type === 'tablet_line_number') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const line = {
                    lineNumber: token.value[0],
                    characterPosition: token.pos,
                    original_text: token.value[1],
                    words: []} as Line;
                last_part.lines.push(line);
            } else if (token.type === 'tablet_word_separator') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const word = {
                    id: '',
                    characterPosition: token.pos,
                    text: token.value,
                    wordNumber: last_line.words.length + 1,
                    signs: [],
                } as Word;
                last_line.words.push(word);
            } else if (token.type === 'tablet_sign') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const last_word = last_line.words[last_line.words.length - 1];

                const sign = {
                    characterPosition: token.pos,
                    text: token.value,
                    signNumber: last_word.signs.length + 1
                } as Sign;

                if (last_word.signs.length === 0) {
                    sign.prefix = '';
                } else {
                    const last_sign = last_word.signs[last_word.signs.length - 1];
                    sign.prefix = atfString.substring(last_sign.characterPosition + last_sign.text.length, sign.characterPosition);
                }

                last_word.signs.push(sign);

             }
             //ignore other tokens
        });

        
        return tablet;
    }

}

