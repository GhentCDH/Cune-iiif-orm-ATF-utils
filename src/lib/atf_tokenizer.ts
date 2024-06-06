import Tokenizr from 'tokenizr';

// See https://build-oracc.museum.upenn.edu/doc/help/editinginatf/primer/structuretutorial/index.html
// for a description of the ATF format.

class ATFTokenizer {
    private tokenizer: Tokenizr;

    constructor() {
        this.tokenizer = new Tokenizr();
        this.setupRules();
    }

    private setupRules() {

        //tablet part indication @obverse, @reverse, @edge
        this.tokenizer.rule(/\@.+/, (ctx, match) => {
            ctx.accept('tablet_part', match);
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
        this.tokenizer.rule(/#.*/, (ctx, match) => {
            ctx.accept('tablet_comment', match);
        });

        //tablet  line number
        this.tokenizer.rule(/[0-9]+\. /, (ctx, match) => {
            ctx.accept('tablet_part_line_number', parseInt(match[0]));
        });

        //tablet sign
        this.tokenizer.rule(/(\{|\.)?(.+?)(-|\s|\.|#\s*|\}\s*)/, (ctx, match) => {
            ctx.accept('tablet_character', match[2]);
            console.log(match);
        });

        //this.tokenizer.rule(/.*/, (ctx, match) => {
        //    ctx.accept('line', match);
        //});

        this.tokenizer.rule(/.+/, (ctx, match) => {
            ctx.accept('line', match);
        });

        this.tokenizer.rule(/\r?\n/, (ctx, match) => {
            //ctx.accept('newline', match);
            ctx.ignore();
        });
    }

    tokenize(atfString: string) {
        const tokens = [];

        this.tokenizer.input(atfString);
        this.tokenizer.tokens().forEach((token) => {
             tokens.push(token.toString()); 
        });


        return tokens;
    }
}

export default ATFTokenizer;

// Usage example
