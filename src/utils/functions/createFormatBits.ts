import { QRErrorCorrectionValue, QRMask } from "../../types/QRTypes"
import { XOR } from "./xor"

export function createFormatBits(correctFormat: QRErrorCorrectionValue, mask: QRMask): string {
  const generator = "10100110111" // Generator polynomial for format bits (15, 5, 2)
  const defaultMask = "101010000010010" // Default mask for format bits
  const generatorLength = generator.length
  const totalFormatBitsLength = 15

  const formatBits = (correctFormat + mask).padEnd(totalFormatBitsLength, "0") // 5 bits + 10 bits of 0s because of the generator polynomial has 11 bits (11 - 1)
  let remainder = formatBits.substring(0, generatorLength)
  let counter = generatorLength

  while (counter <= formatBits.length) {
    remainder = XOR(remainder, generator)
    counter += generatorLength - remainder.length
    if (counter <= formatBits.length) {
      remainder = remainder.padEnd(generatorLength, "0")
    } else {
      remainder = remainder.padStart(generatorLength - 1, "0")
    }
  }

  const finalFormatBits = correctFormat + mask + remainder
  const finalFormatBitsWithDefaultMask = XOR(finalFormatBits, defaultMask).padStart(totalFormatBitsLength, "0")

  return finalFormatBitsWithDefaultMask
}