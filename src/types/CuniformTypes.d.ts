
export type ATFElement = {
    characterPosition: number;
    id: string;
};

export type Sign = ATFElement & {
    text: string;
    signNumber: number,
    prefix?: string;
    suffix?: string;
};

export type Word = ATFElement &  {
    text: string;
    signs: Sign[];
    
    wordNumber: number;
};
  
export type Line = ATFElement &  {
    lineNumber: number;
    original_text: string;
    words: Word[];
};

//export type LineSelector = Omit<Line, 'characterPosition'>;

export type Part =  {
    name: string;
    lines: Line[];
};

export type Tablet = {
    parts: Part[];
};

