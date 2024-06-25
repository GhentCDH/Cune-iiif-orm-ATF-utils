import Tokenizr,  {Token} from 'tokenizr';
import type{ ATFLine, ATFPart, ATFSign,  ATFTablet,  ATFWord } from '../types/CuniformTypes';


// See https://build-oracc.museum.upenn.edu/doc/help/editinginatf/primer/structuretutorial/index.html
// for a description of the ATF format.


export default class ATFTokenizer {
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

    tokenize(atfString: string) : ATFTablet {

        const tablet: ATFTablet = {
            parts: [],
            characterPosition: 0,
            id: '',
            text: atfString,
            cssClass: 'atf_tablet'
        };

        this.tokenizer.input(atfString);

        this.tokenizer.tokens().forEach((token: Token) => {

            if (token.type === 'tablet_part') {
                const part = {
                    characterPosition: token.pos,
                    partNumber: tablet.parts.length + 1,
                    id: token.value,
                    cssClass: 'atf_part',
                    text: token.value,
                    lines: []
                } as ATFPart;
                tablet.parts.push(part);
            } else if (token.type === 'tablet_line_number') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const line = {
                    id: '',
                    cssClass: 'atf_line',
                    lineNumber: token.value[0],
                    characterPosition: token.pos,
                    text: token.value[1],
                    words: []} as ATFLine;
                last_part.lines.push(line);
            } else if (token.type === 'tablet_word_separator') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const word = {
                    id: '',
                    cssClass: 'atf_word',
                    characterPosition: token.pos,
                    text: '',
                    wordNumber: last_line.words.length + 1,
                    signs: [],
                } as ATFWord;
                last_line.words.push(word);
            } else if (token.type === 'tablet_sign') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const last_word = last_line.words[last_line.words.length - 1];

                const sign = {
                    characterPosition: token.pos,
                    cssClass: 'atf_sign',
                    text: token.value,
                    signNumber: last_word.signs.length + 1
                } as ATFSign;

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

        //Now that we have all the tokens, we can reconstruct the text of the words
        for(const part of tablet.parts) {
            for(const line of part.lines) {
                for(const word of line.words) {
                    for(const sign of word.signs) {
                        word.text += (sign.prefix || '') + sign.text + (sign.suffix || '');
                    }
                }
            }
        }
        
        return tablet;
    }

}

