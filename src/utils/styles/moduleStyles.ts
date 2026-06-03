export interface ModuleRenderContext {
  row: number
  col: number
  size: number
  isDark: (row: number, col: number) => boolean
}

export interface QRModuleStyle {
  /** Identifier used as the <select> value */
  id: string
  /** Human-readable label shown in the <select> */
  label: string
  /**
   * When true, finder-pattern modules (cell value 3) are rendered with this
   * style.  When false they always fall back to a solid square so the three
   * finder patterns stay reliably scannable.
   */
  finderSafe: boolean
  /**
   * Returns the SVG path `d` string for a single dark module.
   * The same string is used by both canvas (Path2D) and SVG export, which
   * guarantees a pixel-perfect match between the preview and the download.
   */
  buildPath: (ctx: ModuleRenderContext) => string
}

// ---------------------------------------------------------------------------
// Registered styles — add a new object here to introduce a new style without
// touching any other file (Open / Closed principle).
// ---------------------------------------------------------------------------

export const QR_MODULE_STYLES: QRModuleStyle[] = [
  // ── Cuadrados ─────────────────────────────────────────────────────────────
  {
    id: 'square',
    label: 'Cuadrados',
    finderSafe: true,
    buildPath: ({ col, row, size }) => {
      const px = col * size, py = row * size
      return `M ${px} ${py} h ${size} v ${size} h ${-size} Z`
    },
  },

  // ── Círculos ──────────────────────────────────────────────────────────────
  {
    id: 'circle',
    label: 'Círculos',
    finderSafe: true,
    buildPath: ({ col, row, size }) => {
      const px = col * size, py = row * size
      const r = size / 2
      const cx = px + r, cy = py + r
      // Two 180° arcs drawn with sweep=1 (clockwise) trace a full circle.
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
    },
  },

  // ── Redondeados ───────────────────────────────────────────────────────────
  // Port of the original canvas-arcTo logic translated to SVG arc commands.
  // Each of the four corners is rounded only when BOTH of its two orthogonal
  // neighbours are absent (light or off-grid), creating connected blobs.
  {
    id: 'rounded',
    label: 'Redondeados',
    finderSafe: true,
    buildPath: ({ col, row, size, isDark }) => {
      const px = col * size, py = row * size
      const r = size / 2

      // Corner is rounded when both orthogonal neighbours are NOT dark.
      const tr = !isDark(row - 1, col) && !isDark(row, col + 1)
      const br = !isDark(row + 1, col) && !isDark(row, col + 1)
      const bl = !isDark(row + 1, col) && !isDark(row, col - 1)
      const tl = !isDark(row - 1, col) && !isDark(row, col - 1)

      // All arcs share the same centre (px+r, py+r) = centre of the cell
      // and sweep clockwise (sweep=1), connecting edge midpoints.
      let d = `M ${px + r} ${py} `
      d += tr
        ? `A ${r} ${r} 0 0 1 ${px + size} ${py + r} `
        : `L ${px + size} ${py} L ${px + size} ${py + r} `
      d += br
        ? `A ${r} ${r} 0 0 1 ${px + r} ${py + size} `
        : `L ${px + size} ${py + size} L ${px + r} ${py + size} `
      d += bl
        ? `A ${r} ${r} 0 0 1 ${px} ${py + r} `
        : `L ${px} ${py + size} L ${px} ${py + r} `
      d += tl
        ? `A ${r} ${r} 0 0 1 ${px + r} ${py} `
        : `L ${px} ${py} L ${px + r} ${py} `
      return d + 'Z'
    },
  },

  // ── Puntos ────────────────────────────────────────────────────────────────
  // Small circles (r ≈ 42 % of cell size) that leave a visible gap between
  // modules.  finderSafe: false — finder-pattern modules always use square.
  {
    id: 'dots',
    label: 'Puntos',
    finderSafe: false,
    buildPath: ({ col, row, size }) => {
      const px = col * size, py = row * size
      const r = size * 0.42
      const cx = px + size / 2, cy = py + size / 2
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
    },
  },

  // ── Classy ────────────────────────────────────────────────────────────────
  // Rounds only the top-left and bottom-right corners (r = size / 2), leaving
  // the other two square.  Creates a distinctive diagonal slash look that
  // works on every module uniformly.
  {
    id: 'classy',
    label: 'Classy',
    finderSafe: true,
    buildPath: ({ col, row, size }) => {
      const px = col * size, py = row * size
      const r = size / 2
      // Clockwise path; TL arc: 180°→270° (sweep=1), BR arc: 0°→90° (sweep=1)
      return (
        `M ${px + r} ${py} ` +
        `L ${px + size} ${py} ` +                                   // top-right (square)
        `L ${px + size} ${py + size - r} ` +
        `A ${r} ${r} 0 0 1 ${px + size - r} ${py + size} ` +        // BR arc
        `L ${px} ${py + size} ` +                                   // bottom-left (square)
        `L ${px} ${py + r} ` +
        `A ${r} ${r} 0 0 1 ${px + r} ${py} ` +                      // TL arc
        'Z'
      )
    },
  },

  // ── Barras verticales ─────────────────────────────────────────────────────
  // Modules connect into vertical bars; end-caps are semicircular.
  // finderSafe: false — finder modules use solid square.
  {
    id: 'bars-vertical',
    label: 'Barras verticales',
    finderSafe: false,
    buildPath: ({ col, row, size, isDark }) => {
      const px = col * size, py = row * size
      const r = size / 2
      const hasUp   = isDark(row - 1, col)
      const hasDown = isDark(row + 1, col)

      if (!hasUp && !hasDown) {
        // Vertical pill: top cap + right edge + bottom cap + left edge (via Z)
        return (
          `M ${px} ${py + r} ` +
          `A ${r} ${r} 0 0 1 ${px + size} ${py + r} ` +              // top cap (over)
          `L ${px + size} ${py + size - r} ` +
          `A ${r} ${r} 0 0 1 ${px} ${py + size - r} ` +              // bottom cap (under)
          'Z'
        )
      }
      if (!hasUp) {
        // Top cap only
        return (
          `M ${px} ${py + r} ` +
          `A ${r} ${r} 0 0 1 ${px + size} ${py + r} ` +
          `L ${px + size} ${py + size} L ${px} ${py + size} ` +
          'Z'
        )
      }
      if (!hasDown) {
        // Bottom cap only
        return (
          `M ${px} ${py} ` +
          `L ${px + size} ${py} L ${px + size} ${py + size - r} ` +
          `A ${r} ${r} 0 0 1 ${px} ${py + size - r} ` +
          'Z'
        )
      }
      // Connected on both ends — plain rectangle
      return `M ${px} ${py} h ${size} v ${size} h ${-size} Z`
    },
  },

  // ── Barras horizontales ───────────────────────────────────────────────────
  // Modules connect into horizontal bars; end-caps are semicircular.
  // finderSafe: false — finder modules use solid square.
  {
    id: 'bars-horizontal',
    label: 'Barras horizontales',
    finderSafe: false,
    buildPath: ({ col, row, size, isDark }) => {
      const px = col * size, py = row * size
      const r = size / 2
      const hasLeft  = isDark(row, col - 1)
      const hasRight = isDark(row, col + 1)

      if (!hasLeft && !hasRight) {
        // Horizontal pill
        return (
          `M ${px + r} ${py} ` +
          `L ${px + size - r} ${py} ` +
          `A ${r} ${r} 0 0 1 ${px + size - r} ${py + size} ` +       // right cap
          `L ${px + r} ${py + size} ` +
          `A ${r} ${r} 0 0 1 ${px + r} ${py} ` +                     // left cap
          'Z'
        )
      }
      if (!hasLeft) {
        // Left cap only (right side connects)
        return (
          `M ${px + r} ${py} ` +
          `L ${px + size} ${py} L ${px + size} ${py + size} ` +
          `L ${px + r} ${py + size} ` +
          `A ${r} ${r} 0 0 1 ${px + r} ${py} ` +
          'Z'
        )
      }
      if (!hasRight) {
        // Right cap only (left side connects)
        return (
          `M ${px} ${py} ` +
          `L ${px + size - r} ${py} ` +
          `A ${r} ${r} 0 0 1 ${px + size - r} ${py + size} ` +
          `L ${px} ${py + size} ` +
          'Z'
        )
      }
      // Connected on both ends — plain rectangle
      return `M ${px} ${py} h ${size} v ${size} h ${-size} Z`
    },
  },

  // ── Diamante ──────────────────────────────────────────────────────────────
  // Each module is a rotated square (rhombus).
  // finderSafe: false — finder modules use solid square.
  {
    id: 'diamond',
    label: 'Diamante',
    finderSafe: false,
    buildPath: ({ col, row, size }) => {
      const px = col * size, py = row * size
      const r = size / 2
      return `M ${px + r} ${py} L ${px + size} ${py + r} L ${px + r} ${py + size} L ${px} ${py + r} Z`
    },
  },
]

/** Returns the style matching `id`, or the first style (square) as fallback. */
export const getModuleStyle = (id: string): QRModuleStyle =>
  QR_MODULE_STYLES.find(s => s.id === id) ?? QR_MODULE_STYLES[0]
