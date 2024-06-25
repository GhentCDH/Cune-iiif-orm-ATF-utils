
export type ATFNamedEntity = {
    atf_form: string;
    type: string;
    name: string;
};

/**
 * Represents an ATF (Akkadian Text Format) element.
 */
export type ATFElement = {
    /**
     * The character position of the element in the original ATF text.
     */
    characterPosition: number;
    /**
     * The unique identifier of the element.
     */
    id: string;
    /**
     * The text content of the element.
     */
    text: string;
    /**
     * The CSS class associated with the element.
     */
    cssClass: string;
    /**
     * An array of integers representing the selector of the element.
     */
    selector: Array<number>;
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
