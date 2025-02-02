import { QRErrorCorrectionKey, QRVersion } from "../../types/QRTypes";
import { divideReedSolomonPolynomials, generateReedSolomonPolynomial } from "./generateReedSolomonPolynomial";
import { getQRCorrectionErrorBits } from "./getQRCorrectionErrorBits";

export function generateCorrectionErrorData(version: QRVersion, errorCorrectionLevel: QRErrorCorrectionKey, data: string): string {
  const { correctionBytes } = getQRCorrectionErrorBits(version, errorCorrectionLevel)

  const reedSolomonPolynomial = generateReedSolomonPolynomial(correctionBytes)
  const dataPolynomial = data
    .match(/.{1,8}/g)
    ?.map(byte => parseInt(byte, 2))
  
  if (!dataPolynomial) throw new Error("Data polynomial is empty")
  
  const remainder = divideReedSolomonPolynomials(dataPolynomial, reedSolomonPolynomial)

  const correctionErrorData = remainder
    .map(byte => byte.toString(2).padStart(8, "0"))
    .join("")
  
  return correctionErrorData
}