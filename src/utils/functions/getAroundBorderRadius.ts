import { QRMatrixType } from "../../types/QRTypes"

export function getAroundBorderRadius(matrix: QRMatrixType, row: number, column: number): { borderTopLeftRadius: string, borderTopRightRadius: string, borderBottomLeftRadius: string, borderBottomRightRadius: string } {
  const aroundBorderRadius = {
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",
  }

  if ((matrix[row - 1] && matrix[row - 1][column] % 2 === 0 && matrix[row][column - 1] % 2 === 0) || (!matrix[row - 1] && !matrix[row][column - 1]) || (!matrix[row - 1] && matrix[row][column - 1] % 2 === 0) || (matrix[row - 1] && matrix[row - 1][column] % 2 === 0 && !matrix[row][column - 1])) {
    aroundBorderRadius.borderTopLeftRadius = "50%"
  }

  if ((matrix[row - 1] && matrix[row - 1][column] % 2 === 0 && matrix[row][column + 1] % 2 === 0) || (!matrix[row - 1] && !matrix[row][column + 1]) || (!matrix[row - 1] && matrix[row][column + 1] % 2 === 0) || (matrix[row - 1] && matrix[row - 1][column] % 2 === 0 && !matrix[row][column + 1])) {
    aroundBorderRadius.borderTopRightRadius = "50%"
  }

  if ((matrix[row + 1] && matrix[row + 1][column] % 2 === 0 && matrix[row][column - 1] % 2 === 0) || (!matrix[row + 1] && !matrix[row][column - 1]) || (!matrix[row + 1] && matrix[row][column - 1] % 2 === 0) || (matrix[row + 1] && matrix[row + 1][column] % 2 === 0 && !matrix[row][column - 1])) {
    aroundBorderRadius.borderBottomLeftRadius = "50%"
  }

  if ((matrix[row + 1] && matrix[row + 1][column] % 2 === 0 && matrix[row][column + 1] % 2 === 0) || (!matrix[row + 1] && !matrix[row][column + 1]) || (!matrix[row + 1] && matrix[row][column + 1] % 2 === 0) || (matrix[row + 1] && matrix[row + 1][column] % 2 === 0 && !matrix[row][column + 1])) {
    aroundBorderRadius.borderBottomRightRadius = "50%"
  }

  return aroundBorderRadius
}