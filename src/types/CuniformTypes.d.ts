
export type ATFNamedEntity = {
    atf_form: string;
    type: string;
    name: string;
};

export type ATFElement = {
    characterPosition: number;
    id: string;
    text: string;
    cssClass: string;
};

export type ATFSign = ATFElement & {
    signNumber: number,
    prefix?: string;
    suffix?: string;
};

export type ATFWord = ATFElement &  {
    wordNumber: number;
    signs: ATFSign[];
};

export type ATFLine = ATFElement &  {
    lineNumber: number;
    words: ATFWord[];
};

export type ATFPart = ATFElement & {
    partNumber: number;    
    lines: ATFLine[];
};

export type ATFTablet = ATFElement & {
    parts: ATFPart[];
};
