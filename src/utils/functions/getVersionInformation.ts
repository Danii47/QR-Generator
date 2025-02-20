import { QRVersion } from "../../types/QRTypes"
import { POLYNOMIAL_GENERATOR_VERSION } from "../constants/POLYNOMIALS_GENERATORS"
import { getCorrectionErrorBCH } from "./getCorrectionErrorBCH"

export function getVersionInformation(version: QRVersion): string | null {
  if (version < 7) return null

  const binaryVersion = version.toString(2).padStart(6, "0")

  const binaryVersionBits = getCorrectionErrorBCH(binaryVersion, POLYNOMIAL_GENERATOR_VERSION)

  return binaryVersionBits
}