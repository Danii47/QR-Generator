import { QRErrorCorrectionKey, QRMask, QRMatrixType, QRVersion } from "../../types/QRTypes"
import { createStartMatrix } from "../functions/createStartMatrix"
import { applyPattern } from "../functions/applyPattern"

/**
 * Builds the final QR matrix from the encoded binary string.
 *
 * This is a pure function — it has no side-effects (no canvas, no DOM).
 * It was extracted from `fillNumber` in App.tsx so that the same matrix
 * can be consumed by multiple renderers (canvas preview, SVG export, …).
 *
 * @param version         QR version (1-40)
 * @param correctionLevel Error correction level
 * @param binaryString    Fully interleaved data + ECC bit string
 * @param mask            The mask pattern to apply
 * @returns               The populated, masked QR matrix
 */
export function buildQRMatrix(
  version: QRVersion,
  correctionLevel: QRErrorCorrectionKey,
  binaryString: string,
  mask: QRMask,
): QRMatrixType {
  const newQRMatrix = createStartMatrix(version, correctionLevel, mask)
  let bits = binaryString
  let cont = false

  // Zigzag data placement (standard QR bit-placement algorithm)
  for (let i = newQRMatrix[0].length - 1; i >= 0; i -= 2) {
    if (i === 6) i--
    const rowIndices = cont
      ? [...Array(newQRMatrix.length).keys()]
      : [...Array(newQRMatrix.length).keys()].reverse()

    for (const j of rowIndices) {
      for (let k = i; k > i - 2; k--) {
        if (!bits) break
        if (newQRMatrix[j][k] !== 0) continue
        newQRMatrix[j][k] = bits.charAt(0) === "0" ? 4 : 5
        bits = bits.substring(1)
      }
    }
    cont = !cont
  }

  applyPattern(newQRMatrix, mask)

  return newQRMatrix
}
