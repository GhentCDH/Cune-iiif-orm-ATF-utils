import Tokenizr,  {Token} from 'tokenizr';
import type{ ATFItem, ATFLine, ATFPart, ATFSign,  ATFTablet,  ATFWord, ATFItemSign} from '../types/CuniformTypes';


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
        this.tokenizer.rule(/@tablet/, (ctx, match) => {
            ctx.ignore();
        });

        //tablet part indication @obverse, @reverse, @edge
        // eslint-disable-next-line no-useless-escape
        const tablet_part_regex = /(@)(.+)/u;
        this.tokenizer.rule(tablet_part_regex, (ctx, match) => {
            ctx.accept('tablet_part', match[2]);
        });
        
        //dollar line
        this.tokenizer.rule(/(\$) (.+)/u, (ctx, match) => {
            ctx.accept('tablet_dollar_line', match[1]);
        });

        //tablet identifier, &
        this.tokenizer.rule(/(&)(.+?)(=>*)?/u, (ctx, match) => {
            ctx.accept('tablet_identifier', match[0]);
        });

        //comment line
        this.tokenizer.rule(/\n ?# ?.*/u, (ctx, match) => {
            ctx.accept('tablet_comment', match);    
        });

        //tablet line number
        this.tokenizer.rule(/[0-9]+\. +/u, (ctx, match) => {
            const remaineder = match.input.substring(match.index);
            const lineText = remaineder.substring(0,remaineder.indexOf('\n'));
            const lineNumber = parseInt(match[0]);
            ctx.accept('tablet_line_number', [lineNumber, lineText]);

            //starts the first word
            ctx.accept('tablet_word_separator', match[0]);
        });

        //tablet sign delimeted by {} e.g. KI ur-{gisz}GIGIR
        // eslint-disable-next-line
        this.tokenizer.rule(/\{?[0-9a-zA-Z\(\)]+#?\}?/u, (ctx, match) => {
            ctx.accept('tablet_sign', match[0]);
        });

        this.tokenizer.rule(/\s*\r?\n/u, (ctx, ) => {
            //ctx.accept('newline', match);
            ctx.ignore();
        });

        this.tokenizer.rule(/\[(\.+|…+)\]\s+/u, (ctx, ) => {
            //ctx.accept('newline', match);

            //TODO: implement handling of missing text
            //for now filler text is ignored, but it could be used to indicate missing text 
            //and add data strutures to the tablet model

            ctx.ignore();
        });

        //Word separators
        this.tokenizer.rule(/[ ;]+/u, (ctx, match) => {
            ctx.accept('tablet_word_separator', match[2]);
        });

        //Sign separators
        // eslint-disable-next-line
        this.tokenizer.rule(/[.<>\-\[\]\?;#/]+/u, (ctx, match) => {
            ctx.accept('tablet_sign_separator', match[2]);
        });        

        this.tokenizer.rule(/.+/, (ctx, match) => {
            console.log('Unmatched, unexpected text: ', match);
            ctx.accept('line', match);
        });
    }

    tokenize(atfString: string) : ATFTablet {

        const tablet: ATFTablet = {
            type: 'tablet',
            parts: [],
            characterPosition: 0,
            text: atfString
        };

        this.tokenizer.input(atfString);

        let signNumber = 1;

        this.tokenizer.tokens().forEach((token: Token) => {

            if (token.type === 'tablet_part') {
                const part = {
                    type: 'part',
                    characterPosition: token.pos,
                    partNumber: tablet.parts.length + 1,
                    text: token.value,
                    lines: [],
                } as ATFPart;
                tablet.parts.push(part);
            } else if (token.type === 'tablet_line_number') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                signNumber = 1;
                const line = {
                    type: 'line',
                    lineNumber: last_part.lines.length + 1,
                    characterPosition: token.pos,
                    text: token.value[1],
                    partName: last_part.text,
                    words: []} as ATFLine;
                last_part.lines.push(line);
            } else if (token.type === 'tablet_word_separator') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const word = {
                    type: 'word',
                    characterPosition: token.pos,
                    text: '',
                    partName: last_part.text,
                    lineNumber: last_line.lineNumber,
                    wordNumber: last_line.words.length + 1,
                    signs: [],
                } as ATFWord;
                last_line.words.push(word);
            } else if (token.type === 'tablet_sign') {
                const last_part = tablet.parts[tablet.parts.length - 1];
                const last_line = last_part.lines[last_part.lines.length - 1];
                const last_word = last_line.words[last_line.words.length - 1];
                
                const sign = {
                    type: 'sign',
                    characterPosition: token.pos,
                    text: token.value,
                    partName: last_part.text,
                    lineNumber: last_line.lineNumber,
                    signNumber: signNumber,
                    wordNumber: last_word.wordNumber,
                } as ATFSign;

                signNumber = signNumber + 1;

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

    static flatten(tablet: ATFTablet) : Array<ATFItem> {
        const elements = new Array<ATFItem>();

        // add all elements to the elements array
        for (const part of tablet.parts) {
            elements.push(ATFTokenizer.flattenPart(part));
            for (const line of part.lines) {                
                elements.push(ATFTokenizer.flattenLine(line));
                for (const word of line.words) {
                    elements.push(ATFTokenizer.flattenWord(word));
                    for (const sign of word.signs) {
                        elements.push(ATFTokenizer.flattenSign(sign));
                    }
                }
            }
        }



        return elements;
    }

    static flattenPart(part: ATFPart) : ATFItem {
        const partSigns = Array<ATFItemSign>();
        const item = {type: 'part', content: part.text, signs: partSigns}
        for (const line of part.lines) {
            partSigns.push(...ATFTokenizer.flattenLine(line).signs);
        }
        return item;        
    }

    static flattenLine(line: ATFLine) : ATFItem {
        const lineSigns = Array<ATFItemSign>();
        const item = {type: 'line', content: line.text, signs: lineSigns}
        for (const word of line.words) {
            lineSigns.push(...ATFTokenizer.flattenWord(word).signs);
        }
        return item;        
    }

    static flattenWord(word: ATFWord) : ATFItem {
        const wordSigns = Array<ATFItemSign>();
        const item = {type: 'word', content: word.text, signs: wordSigns}
        for (const sign of word.signs) {
            wordSigns.push(...ATFTokenizer.flattenSign(sign).signs);
        }
        return item;        
    }

    static flattenSign(sign: ATFSign) : ATFItem {
        const atfItemSign = {} as ATFItemSign;
        atfItemSign.partName = sign.partName;
        atfItemSign.lineNumber = sign.lineNumber;
        atfItemSign.signNumber = sign.signNumber;
        atfItemSign.wordNumber = sign.wordNumber;
        atfItemSign.text = (sign.prefix || '') + sign.text + (sign.suffix || '');
        return {type: 'sign', content: atfItemSign.text, signs: [atfItemSign]};
    }
}

