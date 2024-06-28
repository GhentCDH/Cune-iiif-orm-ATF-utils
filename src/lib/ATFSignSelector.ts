import type { ATFItemSign } from "@/types/CuniformTypes"


export default class ATFSignSelector {
  partName: string
  lineNumber: number
  signNumber: number
  type: string

  constructor(partName: string, lineNumber: number, signNumber: number, type: string) {
    this.partName = partName
    this.lineNumber = lineNumber
    this.signNumber = signNumber
    this.type = type
  }

  toString(): string {
    return `${this.partName}-${this.lineNumber}-${this.signNumber}`
  }

  isEqual(other: ATFSignSelector): boolean {
    return this.toString() === other.toString()
  }

  matches(sign: ATFItemSign): boolean {
    return (
      (this.partName ? this.partName == sign.partName : true) &&
      (this.lineNumber ? this.lineNumber == sign.lineNumber : true) &&
      (this.signNumber ? this.signNumber == sign.signNumber : true)
    )
  }
}
