import { QRMatrixType } from "../../types/QRTypes"
import { QRModuleStyle, getModuleStyle } from "../styles/moduleStyles"

export interface CanvasRenderOptions {
  matrix: QRMatrixType
  style: QRModuleStyle
  color: string
  pixelSize: number
  /** Pre-loaded HTMLImageElement, or null when there is no logo */
  logoImage: HTMLImageElement | null
}

/** Square fallback used for finder-pattern modules when finderSafe=false */
const squarePath = (col: number, row: number, size: number) =>
  `M ${col * size} ${row * size} h ${size} v ${size} h ${-size} Z`

/**
 * Renders the QR matrix onto the given canvas element.
 * Returns without drawing if `canvas` is null.
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement | null,
  opts: CanvasRenderOptions,
): void {
  if (!canvas) return

  const { matrix, style, color, pixelSize: size, logoImage } = opts
  const matrixSize = matrix.length

  canvas.width  = matrixSize * size
  canvas.height = matrixSize * size

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // White background
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Logo zone
  let centerStart = -1
  let centerEnd   = -1

  if (logoImage) {
    const rawSize   = Math.floor(matrixSize * 0.22)
    const logoZone  = rawSize % 2 === 0 ? rawSize + 1 : (rawSize < 5 ? 5 : rawSize)
    const center    = Math.floor(matrixSize / 2)
    const halfZone  = Math.floor(logoZone / 2)
    centerStart     = center - halfZone
    centerEnd       = center + halfZone
  }

  // Build a single combined path from all dark modules
  const isDark = (r: number, c: number) => (matrix[r]?.[c] ?? 0) % 2 !== 0

  let pathData = ""
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      // Skip the logo zone
      if (
        logoImage &&
        rowIndex >= centerStart && rowIndex <= centerEnd &&
        colIndex >= centerStart && colIndex <= centerEnd
      ) {
        return
      }

      if (value % 2 === 0) return // light module — skip (background is white)

      // value === 3  → function-pattern module (finder, alignment, timing)
      // value === 5  → data module
      const isFunctionModule = value === 3
      const useSquare = !style.finderSafe && isFunctionModule

      const ctx2d = { row: rowIndex, col: colIndex, size, isDark }
      pathData += useSquare
        ? squarePath(colIndex, rowIndex, size)
        : style.buildPath(ctx2d)
    })
  })

  ctx.fillStyle = color
  ctx.fill(new Path2D(pathData))

  // Overlay logo
  if (logoImage) {
    const rawSize       = Math.floor(matrixSize * 0.22)
    const logoZone      = rawSize % 2 === 0 ? rawSize + 1 : (rawSize < 5 ? 5 : rawSize)
    const logoModPad    = 1
    const available     = (logoZone - logoModPad * 2) * size
    const centerX       = canvas.width  / 2
    const centerY       = canvas.height / 2
    const aspect        = logoImage.width / logoImage.height
    const drawW         = aspect > 1 ? available : available * aspect
    const drawH         = aspect > 1 ? available / aspect : available

    ctx.drawImage(
      logoImage,
      centerX - drawW / 2,
      centerY - drawH / 2,
      drawW,
      drawH,
    )
  }
}

/** Re-renders the QR from a style-id string (convenience wrapper for App). */
export function renderToCanvasById(
  canvas: HTMLCanvasElement | null,
  matrix: QRMatrixType,
  styleId: string,
  color: string,
  pixelSize: number,
  logoImage: HTMLImageElement | null,
): void {
  renderToCanvas(canvas, {
    matrix,
    style: getModuleStyle(styleId),
    color,
    pixelSize,
    logoImage,
  })
}
