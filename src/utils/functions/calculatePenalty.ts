export function calculatePenalty(matrix: number[][]): number {
  let penalty = 0

  // Rule 1
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let count = 0
      for (let k = j; k < matrix[i].length; k++) {
        if (matrix[i][j] === matrix[i][k]) {
          count++
        } else {
          break
        }
      }

      if (count >= 5) {
        penalty += 3 + (count - 5) // Always 3 + the number of extra cells
      }
    }
  }

  return penalty
}