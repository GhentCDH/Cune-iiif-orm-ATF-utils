
export type ATFElement = {
    characterPosition: number;
    id: string;
    cssClass: string;
};

export type ATFSign = ATFElement & {
    text: string;
    signNumber: number,
    prefix?: string;
    suffix?: string;
};

export type ATFWord = ATFElement &  {
    text: string;
    signs: ATFSign[];
    
    wordNumber: number;
};
  
export type ATFLine = ATFElement &  {
    lineNumber: number;
    original_text: string;
    words: ATFWord[];
};

//export type LineSelector = Omit<Line, 'characterPosition'>;

export type ATFPart =  {
    name: string;
    lines: ATFLine[];
};

export type Tablet = {
    parts: ATFPart[];
};

