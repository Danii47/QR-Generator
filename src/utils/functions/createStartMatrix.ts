import { QRErrorCorrectionKey, QRMask, QRVersion } from "../../types/QRTypes"
import { ERROR_CORRECTION } from "../constants/ERROR_CORRECTION_DICTIONARY"
import { createFormatBits } from "./createFormatBits"
import { getCoordinateGrid } from "./getCoordinateGrid"

export function createStartMatrix(version: QRVersion, errorCorrectionLevel: QRErrorCorrectionKey, mask: QRMask) {
  const size = version * 4 + 17 // The size of the matrix is always 4 times the version + 17
  const matrix = new Array(size).fill(null).map(() => new Array(size).fill(0))

  // Create the finder patterns (corner squares)
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i === 7 || j === 7 || ((i === 1 || i === 5) && (j >= 1 && j <= 5)) || ((j === 1 || j === 5) && (i >= 1 && i <= 5))) {
        matrix[i][j] = 2
        matrix[i][size - j - 1] = 2
        matrix[size - i - 1][j] = 2
      } else {
        matrix[i][j] = 3
        matrix[i][size - j - 1] = 3
        matrix[size - i - 1][j] = 3
      }
    }
  }

  // Create the zebra stripes
  const zebraStipesRowAndColumn = 6
  for (let i = 0; i < matrix[zebraStipesRowAndColumn].length; i++) {
    if (matrix[i][zebraStipesRowAndColumn])
      continue

    if (i % 2 === 0) {
      matrix[zebraStipesRowAndColumn][i] = 3
      matrix[i][zebraStipesRowAndColumn] = 3
    } else {
      matrix[zebraStipesRowAndColumn][i] = 2
      matrix[i][zebraStipesRowAndColumn] = 2
    }
  }

  // Create the format bits
  const formatBits = createFormatBits(ERROR_CORRECTION[errorCorrectionLevel], mask)
  
  let topLeftCounter = 0
  let bottomLeftAndTopRightCounter = 0

  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === 0) {
      matrix[8][i] = parseInt(formatBits.charAt(topLeftCounter)) === 0 ? 2 : 3
      matrix[i][8] = parseInt(formatBits.charAt(formatBits.length - topLeftCounter - 1)) === 0 ? 2 : 3
      topLeftCounter++
    }

    if (i < 7) {
      matrix[matrix.length - i - 1][8] = parseInt(formatBits.charAt(bottomLeftAndTopRightCounter)) === 0 ? 2 : 3
    }
    
    if (i < 8) {
      matrix[8][matrix[8].length - i - 1] = parseInt(formatBits.charAt(formatBits.length - bottomLeftAndTopRightCounter - 1)) === 0 ? 2 : 3
    }

    bottomLeftAndTopRightCounter++
  }

  // Set black bit at the bottom left corner
  matrix[size - 8][8] = 5

  // Align patterns
  const coordinatesGrid = getCoordinateGrid(version)
  if (coordinatesGrid) {
    for (let i = 0; i < coordinatesGrid.length; i++) {

      const x = coordinatesGrid[i][0]
      const y = coordinatesGrid[i][1]

      for (let j = -2; j <= 2; j++) {
        for (let k = -2; k <= 2; k++) {
          if (((j === -1 || j === 1) && (k >= -1 && k <= 1)) || ((k === -1 || k === 1) && (j >= -1 && j <= 1))) {
            matrix[x + j][y + k] = 2
          } else {
            matrix[x + j][y + k] = 3
          }
        }
      }
    }
  }

  return matrix
}