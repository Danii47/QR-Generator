import { QRErrorCorrectionValue, QRMask } from "../../types/QRTypes"
import { XOR } from "./xor"

export function createFormatBits(correctFormat: QRErrorCorrectionValue, mask: QRMask): string {
  const generator = "10100110111" // Generator polynomial for format bits (15, 5, 2) (x + 1)*(x + 2)*...*(x + 2^10)
  const defaultMask = "101010000010010" // Default mask for format bits
  const generatorLength = generator.length
  const totalFormatBitsLength = 15

  const formatBits = (correctFormat + mask).padEnd(totalFormatBitsLength, "0") // 5 bits + 10 bits of 0s because of the generator polynomial has 11 bits (11 - 1)
  const bits: [string, string | null] = [formatBits.substring(0, generatorLength), formatBits.substring(generatorLength)]
  
  let counter: number

  while (bits[1] != null && bits[0].length >= generatorLength) {
    bits[0] = XOR(bits[0], generator)
    counter = generatorLength - bits[0].length
    bits[0] += bits[1].substring(0, counter)
    bits[1] = bits[1] ? bits[1].substring(counter) : null
  }

  bits[0] = bits[0].padStart(generatorLength - 1, "0")
  
  const finalFormatBits = correctFormat + mask + bits[0]
  const finalFormatBitsWithDefaultMask = XOR(finalFormatBits, defaultMask).padStart(totalFormatBitsLength, "0")
  
  return finalFormatBitsWithDefaultMask
}