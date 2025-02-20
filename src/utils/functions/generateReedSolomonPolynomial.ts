function generateGFTables(): { gfExp: number[], gfLog: number[] } {
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

export function divideReedSolomonPolynomials(dividend: number[], divisor: number[]): number[] {
  // Cantidad de bytes de corrección (grado del generador)
  const numECC = divisor.length - 1

  // Extender el dividendo: se multiplica por x^(numECC) (se añaden ceros al final)
  const paddedDividend = dividend.concat(new Array(numECC).fill(0))

  // Hacemos una copia (para trabajar sin modificar el original)
  const remainder = paddedDividend.slice()

  // n: longitud total del polinomio extendido
  // k: longitud del polinomio divisor (grado + 1)
  const n = remainder.length
  const k = divisor.length

  // Algoritmo de división "long division" en GF(256)
  // Se recorre desde el coeficiente de mayor grado (índice 0) hasta el índice n - k
  for (let i = 0; i <= n - k; i++) {
    // coeficiente actual (líder) del resto
    const coef = remainder[i]
    if (coef !== 0) {
      // Para cada coeficiente del divisor, se "resta" (XOR) el divisor multiplicado
      // por el coeficiente actual, en GF(256)
      for (let j = 0; j < k; j++) {
        remainder[i + j] ^= gfMultiply(divisor[j], coef)
      }
    }
  }

  // El resto (ECC) corresponde a los últimos numECC coeficientes
  return remainder.slice(n - numECC)
}
