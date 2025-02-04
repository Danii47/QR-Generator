// If function returns true, the cell will be inverted

export const PATTERNS_FUNCTIONS: Record<string, (i: number, j: number) => boolean> = {
  "000": (row, column) => (row + column) % 2 === 0,
  "001": (row) => row % 2 === 0,
  "010": (_, column) => column % 3 === 0,
  "011": (row, column) => (row + column) % 3 === 0,
  "100": (row, column) => (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0,
  "101": (row, column) => (row * column) % 2 + (row * column) % 3 === 0,
  "110": (row, column) => ((row * column) % 3 + row * column) % 2 === 0,
  "111": (row, column) => ((row * column) % 3 + row + column) % 2 === 0
}
