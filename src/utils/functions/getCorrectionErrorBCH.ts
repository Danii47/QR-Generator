import { XOR } from "./xor"

export function getCorrectionErrorBCH(data: string, generatorPolynomial: string): string {

  const generatorPolynomialLength = generatorPolynomial.length

  const extendedData = data.padEnd(data.length + generatorPolynomialLength - 1, "0")

  const bits: [string, string | null] = [extendedData.substring(0, generatorPolynomialLength), extendedData.substring(generatorPolynomialLength)]

  let counter: number
  
  while (bits[1] != null && bits[0].length >= generatorPolynomialLength) {
    bits[0] = XOR(bits[0], generatorPolynomial)
    counter = generatorPolynomialLength - bits[0].length
    bits[0] += bits[1].substring(0, counter)
    bits[1] = bits[1] ? bits[1].substring(counter) : null
  }

  bits[0] = bits[0].padStart(generatorPolynomialLength - 1, "0")

  return data + bits[0]
}