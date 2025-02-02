import { QRMask } from "../../types/QRTypes";
import { PATTERNS_FUNCTIONS } from "../constants/QR_PATTERNS";

export function applyPattern(matrix: number[][], pattern: QRMask): void {
  const patternFunction = PATTERNS_FUNCTIONS[pattern]

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] != 2 && matrix[i][j] != 3) {
        if (patternFunction(i, j)) {
          matrix[i][j] = matrix[i][j] === 0 || matrix[i][j] === 4 ? 5 : 4
        }
      }
    }
  }
}
