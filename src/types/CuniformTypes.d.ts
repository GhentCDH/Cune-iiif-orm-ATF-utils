export type Sign = {
    characterPosition: number;
    text: string;
    signNumber: number,
    prefix?: string;
    suffix?: string;
};

export type Word = {
    text: string;
    signs: Sign[];
    characterPosition: number;
    wordNumber: number;
};
  
export type Line = {
    characterPosition: number;
    lineNumber: number;
    original_text: string;
    words: Word[];
};

//export type LineSelector = Omit<Line, 'characterPosition'>;

export type Part = {
    name: string;
    lines: Line[];
};

export type Tablet = {
    parts: Part[];
};

