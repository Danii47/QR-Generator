import { QRErrorCorrectionValue, QRMask } from "../../types/QRTypes"
import { POLYNOMIAL_GENERATOR_FORMAT } from "../constants/POLYNOMIALS_GENERATORS"
import { getCorrectionErrorBCH } from "./getCorrectionErrorBCH"
import { XOR } from "./xor"

export function createFormatBits(correctFormat: QRErrorCorrectionValue, mask: QRMask): string {
  const defaultMask = "101010000010010" // Default mask for format bits
  const totalFormatBitsLength = 15

  const formatBits = getCorrectionErrorBCH(correctFormat + mask, POLYNOMIAL_GENERATOR_FORMAT)

  const finalFormatBitsWithDefaultMask = XOR(formatBits, defaultMask).padStart(totalFormatBitsLength, "0")
  
  return finalFormatBitsWithDefaultMask
}