import { useRef, useState, useEffect, useCallback } from "react"
import "./App.css"
import { createStartMatrix } from "./utils/functions/createStartMatrix"
import { QRErrorCorrectionKey, QRMask, QRVersion, QRBitsType } from "./types/QRTypes"
import { QR_INFORMATION } from "./utils/constants/QR_INFORMATION"
import { TYPE_INFORMATION_DICTIONARY } from "./utils/constants/TYPE_INFORMATION_DICTIONARY"
import { applyPattern } from "./utils/functions/applyPattern"
import { stringToBinary } from "./utils/functions/stringToBinary"
import { generateCorrectionErrorData } from "./utils/functions/generateCorrectionErrorData"
import { COMPLETE_BYTES } from "./utils/constants/COMPLETE_BYTES"
import { getQRVersion } from "./utils/functions/getQRVersion"
import { getLengthBits } from "./utils/functions/getLengthBits"
import { FINAL_BLOCK } from "./utils/constants/FINAL_BLOCK"

const MASKS: QRMask[] = ["000", "001", "010", "011", "100", "101", "110", "111"]

function App() {

  const textInputRef = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isGenerated, setIsGenerated] = useState(false)
  const [blackCellsColor, setBlackCellsColor] = useState("#000000")
  const [bitsType, setBitsType] = useState<QRBitsType>("square")

  const [maskIndex, setMaskIndex] = useState(0)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const logoImageRef = useRef<HTMLImageElement | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          logoImageRef.current = img
          if (isGenerated && textInputRef.current && textInputRef.current.value && correctionLevelRef.current) {
            createQR(textInputRef.current.value, correctionLevelRef.current.value as QRErrorCorrectionKey, MASKS[maskIndex])
          }
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    logoImageRef.current = null
    if (isGenerated && textInputRef.current && textInputRef.current.value && correctionLevelRef.current) {
      setTimeout(() => {
        createQR(textInputRef.current!.value, correctionLevelRef.current!.value as QRErrorCorrectionKey, MASKS[maskIndex])
      }, 0)
    }
  }

  const handlePrevMask = () => {
    setMaskIndex((prev) => (prev - 1 + MASKS.length) % MASKS.length)
  }

  const handleNextMask = () => {
    setMaskIndex((prev) => (prev + 1) % MASKS.length)
  }

  const fillNumber = useCallback((version: QRVersion, correctionLevel: QRErrorCorrectionKey, binaryString: string, currentMask: QRMask) => {
    const COLORS: Record<number, string> = {
      0: "white", // Empty
      2: "white", // Finder cell
      3: blackCellsColor, // Filled cell
      4: "white", // White cell
      5: blackCellsColor // Black cell
    }

    const newQRMatrix = createStartMatrix(version, correctionLevel, currentMask)
    let cont = false

    for (let i = newQRMatrix[0].length - 1; i >= 0; i -= 2) {
      if (i === 6) i--
      const rowIndices = cont ? [...Array(newQRMatrix.length).keys()] : [...Array(newQRMatrix.length).keys()].reverse()

      for (const j of rowIndices) {
        for (let k = i; k > i - 2; k--) {
          if (!binaryString) break
          if (newQRMatrix[j][k] !== 0) continue
          newQRMatrix[j][k] = binaryString.charAt(0) === "0" ? 4 : 5
          binaryString = binaryString.substring(1)
        }
      }
      cont = !cont
    }

    applyPattern(newQRMatrix, currentMask)

    const canvas = canvasRef.current
    if (!canvas) return

    setIsGenerated(true)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 30
    const size = pixelSize
    const matrixSize = newQRMatrix.length

    canvas.width = matrixSize * size
    canvas.height = matrixSize * size

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let logoZoneSize = 0
    let centerStart = 0
    let centerEnd = 0

    if (logoImageRef.current) {
      const rawSize = Math.floor(matrixSize * 0.22)
      logoZoneSize = rawSize % 2 === 0 ? rawSize + 1 : rawSize

      if (logoZoneSize < 5) logoZoneSize = 5

      const center = Math.floor(matrixSize / 2)
      const halfZone = Math.floor(logoZoneSize / 2)

      centerStart = center - halfZone
      centerEnd = center + halfZone
    }

    newQRMatrix.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {

        if (logoImageRef.current) {
          if (rowIndex >= centerStart && rowIndex <= centerEnd && columnIndex >= centerStart && columnIndex <= centerEnd) {
            return
          }
        }

        ctx.fillStyle = COLORS[value]
        if (bitsType === "circle") {
          ctx.beginPath()
          ctx.arc(columnIndex * size + (size / 2), rowIndex * size + (size / 2), size / 2, 0, 2 * Math.PI)
          ctx.fill()
          ctx.closePath()
        } else if (bitsType === "rounded") {
          const px = columnIndex * size
          const py = rowIndex * size
          const radius = size / 2
          ctx.beginPath()
          ctx.moveTo(px + radius, py)

          if ((newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex - 1][columnIndex] % 2 === 0 && newQRMatrix[rowIndex][columnIndex + 1] % 2 === 0) || (!newQRMatrix[rowIndex - 1] && !newQRMatrix[rowIndex][columnIndex + 1]) || (!newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex][columnIndex + 1] % 2 === 0) || (newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex - 1][columnIndex] % 2 === 0 && !newQRMatrix[rowIndex][columnIndex + 1])) {
            ctx.arcTo(px + size, py, px + size, py + size, radius)
          } else {
            ctx.lineTo(px + size, py)
            ctx.lineTo(px + size, py + radius)
          }

          if ((newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex + 1][columnIndex] % 2 === 0 && newQRMatrix[rowIndex][columnIndex + 1] % 2 === 0) || (!newQRMatrix[rowIndex + 1] && !newQRMatrix[rowIndex][columnIndex + 1]) || (!newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex][columnIndex + 1] % 2 === 0) || (newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex + 1][columnIndex] % 2 === 0 && !newQRMatrix[rowIndex][columnIndex + 1])) {
            ctx.arcTo(px + size, py + size, px, py + size, radius)
          } else {
            ctx.lineTo(px + size, py + size)
            ctx.lineTo(px + radius, py + size)
          }

          if ((newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex + 1][columnIndex] % 2 === 0 && newQRMatrix[rowIndex][columnIndex - 1] % 2 === 0) || (!newQRMatrix[rowIndex + 1] && !newQRMatrix[rowIndex][columnIndex - 1]) || (!newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex][columnIndex - 1] % 2 === 0) || (newQRMatrix[rowIndex + 1] && newQRMatrix[rowIndex + 1][columnIndex] % 2 === 0 && !newQRMatrix[rowIndex][columnIndex - 1])) {
            ctx.arcTo(px, py + size, px, py, radius)
          } else {
            ctx.lineTo(px, py + size)
            ctx.lineTo(px, py + radius)
          }

          if ((newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex - 1][columnIndex] % 2 === 0 && newQRMatrix[rowIndex][columnIndex - 1] % 2 === 0) || (!newQRMatrix[rowIndex - 1] && !newQRMatrix[rowIndex][columnIndex - 1]) || (!newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex][columnIndex - 1] % 2 === 0) || (newQRMatrix[rowIndex - 1] && newQRMatrix[rowIndex - 1][columnIndex] % 2 === 0 && !newQRMatrix[rowIndex][columnIndex - 1])) {
            ctx.arcTo(px, py, px + radius, py, radius)
          } else {
            ctx.lineTo(px, py)
            ctx.lineTo(px + radius, py)
          }

          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillRect(columnIndex * size, rowIndex * size, size, size)
        }
      })
    })

    if (logoImageRef.current) {
      const img = logoImageRef.current
      const logoModulePadding = 1
      const availableModules = logoZoneSize - (logoModulePadding * 2)
      const availableSizePx = availableModules * size
      const centerX = (canvas.width / 2)
      const centerY = (canvas.height / 2)
      const aspectRatio = img.width / img.height
      let drawWidth = availableSizePx
      let drawHeight = availableSizePx

      if (aspectRatio > 1) {
        drawHeight = availableSizePx / aspectRatio
      } else {
        drawWidth = availableSizePx * aspectRatio
      }

      ctx.drawImage(
        img,
        centerX - (drawWidth / 2),
        centerY - (drawHeight / 2),
        drawWidth,
        drawHeight
      )
    }
  }, [bitsType, blackCellsColor])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `QR-${Date.now()}.png`
    link.click()
  }

  const createQR = useCallback((text: string, correctionLevel: QRErrorCorrectionKey, mask: QRMask) => {
    const encodedType = "byte"
    const binaryText = stringToBinary(text)
    const QRVersion = getQRVersion(binaryText.length, correctionLevel, encodedType)
    const textLengthBinary = text.length.toString(2).padStart(getLengthBits(QRVersion, encodedType), "0")
    const codifiedData = TYPE_INFORMATION_DICTIONARY[encodedType] + textLengthBinary + binaryText + FINAL_BLOCK
    const { dataBits, numberOfBlocksInGroupOne, numberOfBlocksInGroupTwo } = QR_INFORMATION[QRVersion].eccLevels[correctionLevel]
    const totalDataString = codifiedData.padEnd(dataBits, COMPLETE_BYTES)

    const dataBlocks = new Array(numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo)
    const errorBlocks = new Array(numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo)
    const blockCapacitieInGroupOne = Math.floor(totalDataString.length / dataBlocks.length / 8) * 8

    for (let i = 0; i < dataBlocks.length; i++) {
      const start = i * blockCapacitieInGroupOne + (i > numberOfBlocksInGroupOne ? 8 * (i - numberOfBlocksInGroupOne) : 0)
      const end = (i + 1) * blockCapacitieInGroupOne + (i >= numberOfBlocksInGroupOne ? 8 * (i - numberOfBlocksInGroupOne + 1) : 0)
      dataBlocks[i] = totalDataString.substring(start, end)
      errorBlocks[i] = generateCorrectionErrorData(QRVersion, correctionLevel, dataBlocks[i]).match(/.{1,8}/g)
      dataBlocks[i] = dataBlocks[i].match(/.{1,8}/g)
    }

    let dataAndCorrectionErrorString = ""
    for (let i = 0; i < dataBlocks[dataBlocks.length - 1].length; i++) {
      for (let j = 0; j < dataBlocks.length; j++) {
        if (dataBlocks[j][i] !== undefined)
          dataAndCorrectionErrorString += dataBlocks[j][i]
      }
    }
    for (let i = 0; i < errorBlocks[0].length; i++) {
      for (let j = 0; j < errorBlocks.length; j++) {
        dataAndCorrectionErrorString += errorBlocks[j][i]
      }
    }

    fillNumber(QRVersion, correctionLevel, dataAndCorrectionErrorString, mask)
  }, [fillNumber])

  useEffect(() => {
    if (isGenerated && textInputRef.current && textInputRef.current.value && correctionLevelRef.current) {
      createQR(textInputRef.current.value, correctionLevelRef.current.value as QRErrorCorrectionKey, MASKS[maskIndex])
    }
  }, [maskIndex, createQR, isGenerated])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInputRef.current && textInputRef.current.value && correctionLevelRef.current) {
      setMaskIndex(0)
      createQR(textInputRef.current.value, correctionLevelRef.current.value as QRErrorCorrectionKey, MASKS[0])
    }
  }

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
                <select id="qr-bits-type" onChange={(event) => setBitsType(event.target.value as QRBitsType)}>
                  <option value="square">Cuadrados</option>
                  <option value="circle">Círculos</option>
                  <option value="rounded">Redondeados</option>
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
                <input id="select-color-1" type="color" value={blackCellsColor} onChange={(event) => setBlackCellsColor(event.target.value)} />
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
            <button id="canva-button-download" onClick={downloadImage}>
              Descargar PNG
            </button>
          )}
        </section>
      </div>
    </div>
  )
}

export default App