import { useRef, useState, useEffect, useCallback } from "react"
import "./App.css"
import { QRErrorCorrectionKey, QRMask, QRVersion, QRBitsType, QRMatrixType } from "./types/QRTypes"
import { QR_INFORMATION } from "./utils/constants/QR_INFORMATION"
import { TYPE_INFORMATION_DICTIONARY } from "./utils/constants/TYPE_INFORMATION_DICTIONARY"
import { stringToBinary } from "./utils/functions/stringToBinary"
import { generateCorrectionErrorData } from "./utils/functions/generateCorrectionErrorData"
import { COMPLETE_BYTES } from "./utils/constants/COMPLETE_BYTES"
import { getQRVersion } from "./utils/functions/getQRVersion"
import { getLengthBits } from "./utils/functions/getLengthBits"
import { FINAL_BLOCK } from "./utils/constants/FINAL_BLOCK"
import { buildQRMatrix } from "./utils/render/buildMatrix"
import { renderToCanvasById } from "./utils/render/renderToCanvas"
import { renderToSVGById } from "./utils/render/renderToSVG"
import { QR_MODULE_STYLES } from "./utils/styles/moduleStyles"

const MASKS: QRMask[] = ["000", "001", "010", "011", "100", "101", "110", "111"]

function App() {

  const textInputRef       = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const canvasRef          = useRef<HTMLCanvasElement>(null)

  const [isGenerated, setIsGenerated]       = useState(false)
  const [blackCellsColor, setBlackCellsColor] = useState("#000000")
  const [bitsType, setBitsType]             = useState<QRBitsType>("square")
  const [maskIndex, setMaskIndex]           = useState(0)
  const [downloadFormat, setDownloadFormat] = useState<"png" | "svg">("png")

  const [logoFile, setLogoFile]     = useState<File | null>(null)
  const logoImageRef                = useRef<HTMLImageElement | null>(null)
  const logoDataUrlRef              = useRef<string | null>(null)

  // Holds the last generated matrix so re-renders triggered by style/color/
  // mask changes can use it directly without re-encoding the QR data.
  const matrixRef = useRef<QRMatrixType | null>(null)

  // ── Logo handlers ──────────────────────────────────────────────────────────

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        logoDataUrlRef.current = dataUrl

        const img = new Image()
        img.onload = () => {
          logoImageRef.current = img
          if (isGenerated && matrixRef.current) {
            renderToCanvasById(
              canvasRef.current,
              matrixRef.current,
              bitsType,
              blackCellsColor,
              30,
              logoImageRef.current,
            )
          }
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    logoImageRef.current  = null
    logoDataUrlRef.current = null
    if (isGenerated && matrixRef.current) {
      setTimeout(() => {
        renderToCanvasById(
          canvasRef.current,
          matrixRef.current!,
          bitsType,
          blackCellsColor,
          30,
          null,
        )
      }, 0)
    }
  }

  // ── Mask navigation ────────────────────────────────────────────────────────

  const handlePrevMask = () => {
    setMaskIndex((prev) => (prev - 1 + MASKS.length) % MASKS.length)
  }

  const handleNextMask = () => {
    setMaskIndex((prev) => (prev + 1) % MASKS.length)
  }

  // ── Core QR generation ─────────────────────────────────────────────────────

  /**
   * Encodes `text`, builds the QR matrix and renders it to the canvas.
   * Stores the resulting matrix in `matrixRef` so partial re-renders
   * (style, colour, mask changes) can skip re-encoding.
   */
  const createQR = useCallback((
    text: string,
    correctionLevel: QRErrorCorrectionKey,
    mask: QRMask,
  ) => {
    const encodedType    = "byte"
    const binaryText     = stringToBinary(text)
    const QRVersion: QRVersion = getQRVersion(binaryText.length, correctionLevel, encodedType)
    const textLengthBin  = text.length.toString(2).padStart(getLengthBits(QRVersion, encodedType), "0")
    const codifiedData   = TYPE_INFORMATION_DICTIONARY[encodedType] + textLengthBin + binaryText + FINAL_BLOCK

    const { dataBits, numberOfBlocksInGroupOne, numberOfBlocksInGroupTwo } =
      QR_INFORMATION[QRVersion].eccLevels[correctionLevel]

    const totalDataString = codifiedData.padEnd(dataBits, COMPLETE_BYTES)
    const totalBlocks     = numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo
    const dataBlocks      = new Array(totalBlocks)
    const errorBlocks     = new Array(totalBlocks)
    const blockCapacity   = Math.floor(totalDataString.length / totalBlocks / 8) * 8

    for (let i = 0; i < totalBlocks; i++) {
      const start = i * blockCapacity + (i > numberOfBlocksInGroupOne ? 8 * (i - numberOfBlocksInGroupOne) : 0)
      const end   = (i + 1) * blockCapacity + (i >= numberOfBlocksInGroupOne ? 8 * (i - numberOfBlocksInGroupOne + 1) : 0)
      dataBlocks[i]  = totalDataString.substring(start, end)
      errorBlocks[i] = generateCorrectionErrorData(QRVersion, correctionLevel, dataBlocks[i]).match(/.{1,8}/g)
      dataBlocks[i]  = dataBlocks[i].match(/.{1,8}/g)
    }

    let bitString = ""
    for (let i = 0; i < dataBlocks[dataBlocks.length - 1].length; i++) {
      for (let j = 0; j < dataBlocks.length; j++) {
        if (dataBlocks[j][i] !== undefined) bitString += dataBlocks[j][i]
      }
    }
    for (let i = 0; i < errorBlocks[0].length; i++) {
      for (let j = 0; j < errorBlocks.length; j++) {
        bitString += errorBlocks[j][i]
      }
    }

    const matrix = buildQRMatrix(QRVersion, correctionLevel, bitString, mask)
    matrixRef.current = matrix
    setIsGenerated(true)

    renderToCanvasById(
      canvasRef.current,
      matrix,
      bitsType,
      blackCellsColor,
      30,
      logoImageRef.current,
    )
  }, [bitsType, blackCellsColor])

  // ── Re-render when style, colour or mask changes ───────────────────────────

  useEffect(() => {
    if (isGenerated && matrixRef.current) {
      renderToCanvasById(
        canvasRef.current,
        matrixRef.current,
        bitsType,
        blackCellsColor,
        30,
        logoImageRef.current,
      )
    }
  }, [bitsType, blackCellsColor, isGenerated])

  useEffect(() => {
    if (isGenerated && textInputRef.current?.value && correctionLevelRef.current) {
      createQR(
        textInputRef.current.value,
        correctionLevelRef.current.value as QRErrorCorrectionKey,
        MASKS[maskIndex],
      )
    }
  }, [maskIndex, createQR, isGenerated])

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInputRef.current?.value && correctionLevelRef.current) {
      setMaskIndex(0)
      createQR(
        textInputRef.current.value,
        correctionLevelRef.current.value as QRErrorCorrectionKey,
        MASKS[0],
      )
    }
  }

  // ── Download ───────────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (downloadFormat === "png") {
      const canvas = canvasRef.current
      if (!canvas) return
      const link      = document.createElement("a")
      link.href       = canvas.toDataURL("image/png")
      link.download   = `QR-${Date.now()}.png`
      link.click()
      return
    }

    // SVG export — re-uses the exact same buildPath functions as the canvas
    if (!matrixRef.current) return
    const svgString = renderToSVGById(
      matrixRef.current,
      bitsType,
      blackCellsColor,
      30,
      logoDataUrlRef.current,
    )
    const blob  = new Blob([svgString], { type: "image/svg+xml" })
    const url   = URL.createObjectURL(blob)
    const link  = document.createElement("a")
    link.href   = url
    link.download = `QR-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div id="main-wrapper">
      <div id="card">
        {/* CONFIGURATION */}
        <section className="column left-column">
          <div className="header">
            <h1 className="title">Generador QR</h1>
            <p className="subtitle">Crea códigos QR personalizados al instante.</p>
          </div>

          <form id="options-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="link">URL o Texto</label>
              <input
                id="link"
                type="text"
                ref={textInputRef}
                placeholder="https://tuweb.com"
                autoComplete="off"
              />
            </div>

            <div className="options-row">
              <div className="input-group">
                <label htmlFor="qr-bits-type">Estilo</label>
                {/* The <select> is auto-populated from the style registry —
                    no code change needed when adding a new style. */}
                <select
                  id="qr-bits-type"
                  value={bitsType}
                  onChange={(e) => setBitsType(e.target.value as QRBitsType)}
                >
                  {QR_MODULE_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <div className="label-with-tooltip">
                  <label htmlFor="qr-correction-level">Corrección</label>
                  <div className="tooltip-container">
                    <span className="info-icon">i</span>
                    <div className="tooltip-text">
                      Capacidad del QR para ser leído si se daña o se tapa (por ejemplo, con un logo).
                      <br />
                      El porcentaje indica la cantidad de datos que pueden recuperarse.
                      <br /><br />
                      <span style={{ color: '#fff' }}>L (7%)</span> - <span style={{ color: '#fff' }}>M (15%)</span> - <span style={{ color: '#fff' }}>Q (25%)</span> - <span style={{ color: '#fff' }}>H (30%)</span>
                    </div>
                  </div>
                </div>
                <select id="qr-correction-level" ref={correctionLevelRef} defaultValue="H">
                  <option value="L">Baja (L)</option>
                  <option value="M">Media (M)</option>
                  <option value="Q">Alta (Q)</option>
                  <option value="H">Máxima (H)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="logo-upload">Logo (Opcional)</label>
              <div className="file-input-wrapper">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden-file-input"
                />
                <label htmlFor="logo-upload" className="file-label">
                  {logoFile ? (
                    <span className="file-name">{logoFile.name}</span>
                  ) : (
                    <span className="file-placeholder">Seleccionar imagen...</span>
                  )}
                  <span className="upload-icon">📁</span>
                </label>
                {logoFile && (
                  <button type="button" className="remove-file-btn" onClick={handleRemoveLogo} title="Quitar logo">
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="select-color-1">Color de Puntos</label>
              <div className="color-input-wrapper">
                <div className="color-preview" style={{ backgroundColor: blackCellsColor }}></div>
                <input
                  id="select-color-1"
                  type="color"
                  value={blackCellsColor}
                  onChange={(e) => setBlackCellsColor(e.target.value)}
                />
                <span className="color-value">{blackCellsColor.toUpperCase()}</span>
              </div>
            </div>

            <button type="submit" id="button-submit">Generar QR</button>
          </form>
        </section>

        {/* PREVIEW */}
        <section className="column right-column">
          <div id="preview-container">
            {isGenerated && (
              <>
                <div className="qr-mask-counter">
                  {maskIndex + 1} / {MASKS.length}
                </div>
                <button className="mask-arrow arrow-left" onClick={handlePrevMask} title="Máscara anterior">
                  &#8249;
                </button>
                <button className="mask-arrow arrow-right" onClick={handleNextMask} title="Siguiente máscara">
                  &#8250;
                </button>
              </>
            )}

            <div className={`placeholder-qr ${isGenerated ? 'hidden' : ''}`}>
              <div className="placeholder-icon"></div>
              <p>Tu código QR aparecerá aquí</p>
            </div>

            <canvas
              ref={canvasRef}
              width={0}
              height={0}
              className={!isGenerated ? 'hidden-canvas' : ''}
            ></canvas>
          </div>

          {isGenerated && (
            <div className="download-row">
              <select
                className="download-format-select"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as "png" | "svg")}
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
              <button id="canva-button-download" onClick={handleDownload}>
                Descargar {downloadFormat.toUpperCase()}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
