

//the external structures



export interface ATFItemSign {
   partName: string
   lineNumber: number
   signNumber: number
   text: string
}

export type ATFItem = {
    type: string;//'sign' | 'word' | 'line' | 'part';
    content: string;
    signs: Array<ATFItemSign>;
};


export type ATFNamedEntity = {
    atf_form: string;
    type: string;
    name: string;
};


//the internal structures

/**
 * Represents an ATF (Akkadian Text Format) element.
 */
export type ATFElement = {
    type: string;
    /**
     * The character position of the start of the element in the original ATF text.
     */
    characterPosition: number;
    /**
     * The text content of the element.
     */
    text: string;
};

export type ATFSelector = {
    /**
     * The text content of the element.
     */
    text: string;
};


export type ATFSign = ATFElement & {
    signNumber: number,
    partName: string,
    lineNumber: number,
    prefix?: string;
    suffix?: string;
};

export type ATFWord = ATFElement &  {
    wordNumber: number;
    partName: string,
    lineNumber: number;
    signs: ATFSign[];
};

export type ATFLine = ATFElement &  {
    lineNumber: number;
    partName: string,
    words: ATFWord[];
};

export type ATFPart = ATFElement & {
    partNumber: number;    
    lines: ATFLine[];
};

export type ATFTablet = ATFElement & {
    parts: ATFPart[];
};
