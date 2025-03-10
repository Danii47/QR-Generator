import { useRef, useState } from "react"
import "./App.css"
import { createStartMatrix } from "./utils/functions/createStartMatrix"
import { QRBitsType, QRErrorCorrectionKey, QRMask, QRVersion } from "./types/QRTypes"
import { QR_INFORMATION } from "./utils/constants/QR_INFORMATION"
import { TYPE_INFORMATION_DICTIONARY } from "./utils/constants/TYPE_INFORMATION_DICTIONARY"
import { applyPattern } from "./utils/functions/applyPattern"
import { stringToBinary } from "./utils/functions/stringToBinary"
import { generateCorrectionErrorData } from "./utils/functions/generateCorrectionErrorData"
import { COMPLETE_BYTES } from "./utils/constants/COMPLETE_BYTES"
import { getQRVersion } from "./utils/functions/getQRVersion"
import { getLengthBits } from "./utils/functions/getLengthBits"
import { FINAL_BLOCK } from "./utils/constants/FINAL_BLOCK"

const MASK: QRMask = "100"

function App() {

  const textInputRef = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const downloadButtonRef = useRef<HTMLButtonElement>(null)
  const [blackCellsColor, setBlackCellsColor] = useState("black")
  const [bitsType, setBitsType] = useState<QRBitsType>("square")

  const COLORS: Record<number, string> = {
    0: "white", // Empty
    2: "white", // Finder cell
    3: blackCellsColor, // Filled cell
    4: "white", // White cell
    5: blackCellsColor // Black cell
  }

  function fillNumber(version: QRVersion, correctionLevel: QRErrorCorrectionKey, binaryString: string) {

    const newQRMatrix = createStartMatrix(version, correctionLevel, MASK)

    let cont = false

    for (let i = newQRMatrix[0].length - 1; i >= 0; i -= 2) {
      if (i === 6) i--

      const rowIndices = cont ? [...Array(newQRMatrix.length).keys()] : [...Array(newQRMatrix.length).keys()].reverse()

      for (const j of rowIndices) {
        for (let k = i; k > i - 2; k--) {
          if (!binaryString) break

          if (newQRMatrix[j][k] !== 0)
            continue

          newQRMatrix[j][k] = binaryString.charAt(0) === "0" ? 4 : 5
          
          // if (j >= 10 && j < 15 && k >= 10 && k < 15) {
          //   newQRMatrix[j][k] = 2
          // }

          binaryString = binaryString.substring(1)
        }
      }

      cont = !cont
    }

    applyPattern(newQRMatrix, MASK)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let size: number

    if (window.innerWidth < window.innerHeight)
      size = Math.floor((window.innerWidth / newQRMatrix[0].length) * 0.8)
    else 
      size = Math.floor((window.innerHeight / newQRMatrix[0].length) * 0.6)

    canvas.width = newQRMatrix[0].length * size
    canvas.height = newQRMatrix.length * size

    newQRMatrix.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
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

    if (downloadButtonRef?.current)
      downloadButtonRef.current.style.display = "block"
  }


  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "QR.png"
    link.click()
  }

  function createQR(text: string, correctionLevel: QRErrorCorrectionKey) {
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

    fillNumber(QRVersion, correctionLevel, dataAndCorrectionErrorString)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInputRef.current && textInputRef.current.value && correctionLevelRef.current) {
      createQR(textInputRef.current.value, correctionLevelRef.current.value as QRErrorCorrectionKey)
    }
  }

  return (
    <>
      <form id="options-form" onSubmit={handleSubmit}>
        <div id="link-container">
          <label htmlFor="link">Escribe la URL</label>
          <input id="link" type="text" ref={textInputRef} placeholder="https://mipaginaweb.com" />
        </div>
        <div className="options-container">
          <div className="option-container">
            <label htmlFor="qr-bits-type">Estilo</label>
            <select id="qr-bits-type" onChange={(event) => setBitsType(event.target.value as QRBitsType)}>
              <option value="square">Cuadrados</option>
              <option value="circle">Circulos</option>
              <option value="rounded">Redondeados</option>
            </select>
          </div>
          <div className="option-container">
            <label htmlFor="select-color-1">Color</label>
            <input className="select-color" id="select-color-1" type="color" value={blackCellsColor} onChange={(event) => setBlackCellsColor(event.target.value)} />
          </div>
          <div className="option-container">
            <label htmlFor="qr-correction-level">Corrección</label>
            <select id="qr-correction-level" ref={correctionLevelRef}>
              <option value="L">Muy bajo (L)</option>
              <option value="M">Bajo (M)</option>
              <option value="Q">Medio (Q)</option>
              <option value="H">Alto (H)</option>
            </select>
          </div>
        </div>
        <button type="submit" id="button-submit">Generar</button>
      </form>
      <div id="canva-container">
        <canvas ref={canvasRef} width={200} height={200}></canvas>
        <button ref={downloadButtonRef} id="canva-button-download" onClick={downloadImage}>Descargar QR</button>
      </div>
    </>
  )
}

export default App
