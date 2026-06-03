import { QRMatrixType } from "../../types/QRTypes"
import { QRModuleStyle, getModuleStyle } from "../styles/moduleStyles"

export interface SVGRenderOptions {
  matrix: QRMatrixType
  style: QRModuleStyle
  color: string
  pixelSize: number
  /** Data-URL of the logo image (e.g. "data:image/png;base64,…"), or null */
  logoDataUrl: string | null
}

/** Square fallback used for finder-pattern modules when finderSafe=false */
const squarePath = (col: number, row: number, size: number) =>
  `M ${col * size} ${row * size} h ${size} v ${size} h ${-size} Z`

/** See renderToCanvas.ts for rationale — only the 3 corner 8×8 regions. */
const isInFinderRegion = (r: number, c: number, n: number) =>
  (r <= 7 && c <= 7) || (r <= 7 && c >= n - 8) || (r >= n - 8 && c <= 7)

/**
 * Builds an SVG string that is visually identical to the canvas preview.
 *
 * Because both renderers use exactly the same `buildPath` functions from the
 * style registry, the SVG export is guaranteed to match the canvas preview
 * pixel-for-pixel (at the same pixel density).
 */
export function renderToSVG(opts: SVGRenderOptions): string {
  const { matrix, style, color, pixelSize: size, logoDataUrl } = opts
  const matrixSize  = matrix.length
  const totalPx     = matrixSize * size

  // Logo zone (same calculation as canvas renderer)
  let centerStart = -1
  let centerEnd   = -1
  let logoZone    = 0

  if (logoDataUrl) {
    const rawSize  = Math.floor(matrixSize * 0.22)
    logoZone       = rawSize % 2 === 0 ? rawSize + 1 : (rawSize < 5 ? 5 : rawSize)
    const center   = Math.floor(matrixSize / 2)
    const halfZone = Math.floor(logoZone / 2)
    centerStart    = center - halfZone
    centerEnd      = center + halfZone
  }

  const isDark = (r: number, c: number) => (matrix[r]?.[c] ?? 0) % 2 !== 0

  // Accumulate all dark-module sub-paths into one `d` attribute
  let pathData = ""
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (
        logoDataUrl &&
        rowIndex >= centerStart && rowIndex <= centerEnd &&
        colIndex >= centerStart && colIndex <= centerEnd
      ) {
        return
      }

      if (value % 2 === 0) return // light module

      const useSquare = !style.finderSafe && value === 3 && isInFinderRegion(rowIndex, colIndex, matrixSize)

      const ctx = { row: rowIndex, col: colIndex, size, isDark }
      pathData += useSquare
        ? squarePath(colIndex, rowIndex, size)
        : style.buildPath(ctx)
    })
  })

  // Logo <image> element (aspect-fit, same maths as canvas renderer)
  let logoElement = ""
  if (logoDataUrl) {
    // We don't have an HTMLImageElement here; we rely on the aspect ratio
    // being passed in via logoDataUrl.  Because SVG <image> preserves aspect
    // ratio by default (preserveAspectRatio="xMidYMid meet"), we can use a
    // square bounding box centred in the logo zone and the browser will
    // handle the fit.
    const logoModPad  = 1
    const available   = (logoZone - logoModPad * 2) * size
    const cx          = totalPx / 2
    const cy          = totalPx / 2
    const x           = cx - available / 2
    const y           = cy - available / 2
    logoElement = `<image href="${logoDataUrl}" x="${x}" y="${y}" width="${available}" height="${available}" preserveAspectRatio="xMidYMid meet"/>`
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${totalPx}" height="${totalPx}" ` +
    `viewBox="0 0 ${totalPx} ${totalPx}">` +
    `<rect width="${totalPx}" height="${totalPx}" fill="white"/>` +
    `<path d="${pathData}" fill="${color}"/>` +
    logoElement +
    `</svg>`
  )
}

/** Convenience wrapper — looks up the style by id before rendering. */
export function renderToSVGById(
  matrix: QRMatrixType,
  styleId: string,
  color: string,
  pixelSize: number,
  logoDataUrl: string | null,
): string {
  return renderToSVG({
    matrix,
    style: getModuleStyle(styleId),
    color,
    pixelSize,
    logoDataUrl,
  })
}
