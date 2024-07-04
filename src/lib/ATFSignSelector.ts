import type { ATFItemSign } from "@/types/CuniformTypes"


export default class ATFSignSelector {
  partName: string
  lineNumber?: number
  signNumber?: number
  wordNumber?: number

  constructor(partName: string, lineNumber?: number, signNumber?: number, wordNumber?: number) {
    this.partName = partName
    this.lineNumber = lineNumber
    this.signNumber = signNumber
    this.wordNumber = wordNumber
  }

  toString(): string {
    return `${this.partName}-${this.lineNumber}-${this.signNumber}-${this.wordNumber}`
  }

  isEqual(other: ATFSignSelector): boolean {
    return this.toString() === other.toString()
  }

  matches(sign: ATFItemSign): boolean {
    return (
      (this.partName ? this.partName == sign.partName : true) &&
      (this.lineNumber ? this.lineNumber == sign.lineNumber : true) &&
      (this.signNumber ? this.signNumber == sign.signNumber : true) &&
      (this.wordNumber ? this.wordNumber == sign.wordNumber : true)
    )
  }
}
