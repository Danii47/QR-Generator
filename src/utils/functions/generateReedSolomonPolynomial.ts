function generateGFTables(): { gfExp: number[]; gfLog: number[] } {
  const gfExp: number[] = new Array(512)
  const gfLog: number[] = new Array(256)
  let x = 1

  for (let i = 0; i < 255; i++) {
    gfExp[i] = x
    gfLog[x] = i
    x = (x << 1) ^ (x & 0x80 ? 0x11D : 0) // x^8 + x^4 + x^3 + x^2 + 1 (0x11D)
  }

  for (let i = 255; i < 512; i++) {
    gfExp[i] = gfExp[i - 255] // Duplicamos la tabla para evitar overflow
  }

  return { gfExp, gfLog }
}

const { gfExp, gfLog } = generateGFTables()

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return gfExp[(gfLog[a] + gfLog[b]) % 255]
}

export function generateReedSolomonPolynomial(numBytes: number): number[] {
  let poly = [1]

  for (let i = 0; i < numBytes; i++) {
    const newPoly = [0, ...poly]
    for (let j = 0; j < poly.length; j++) {
      newPoly[j] ^= gfMultiply(poly[j], gfExp[i])
    }
    poly = newPoly
  }

  return poly.reverse()
}