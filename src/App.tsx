import { useRef, useState } from "react"
import "./App.css"
import { createStartMatrix } from "./utils/functions/createStartMatrix"
import { QRBitsType, QRErrorCorrectionKey, QRMask, QRMatrixType, QRVersion } from "./types/QRTypes"
import { QR_INFORMATION } from "./utils/constants/QR_INFORMATION"
import { TYPE_INFORMATION_DICTIONARY } from "./utils/constants/TYPE_INFORMATION_DICTIONARY"
import { applyPattern } from "./utils/functions/applyPattern"
import { stringToBinary } from "./utils/functions/stringToBinary"
import { generateCorrectionErrorData } from "./utils/functions/generateCorrectionErrorData"
import { COMPLETE_BYTES } from "./utils/constants/COMPLETE_BYTES"
import { getQRVersion } from "./utils/functions/getQRVersion"
import { getAroundBorderRadius } from "./utils/functions/getAroundBorderRadius"
import { getLengthBits } from "./utils/functions/getLengthBits"
import { FINAL_BLOCK } from "./utils/constants/FINAL_BLOCK"

const MASK: QRMask = "100"

function App() {

  const textInputRef = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [QRMatrix, setQRMatrix] = useState<QRMatrixType>(createStartMatrix(1, "L", MASK))
  const [fillCellsColor, setFillCellsColor] = useState("black")
  const [bitsType, setBitsType] = useState<QRBitsType>("square")

  const COLORS: Record<number, string> = {
    0: "white", // Empty
    2: "white", // Finder cell
    3: fillCellsColor, // Filled cell
    4: "white", // White cell
    5: fillCellsColor // Black cell
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

    canvas.width = newQRMatrix[0].length * 20
    canvas.height = newQRMatrix.length * 20

    newQRMatrix.forEach((fila, y) => {
      fila.forEach((valor, x) => {
        ctx.fillStyle = COLORS[valor]
        if (bitsType === "circle") {
          ctx.beginPath()
          ctx.arc(x * 20 + 10, y * 20 + 10, 10, 0, 2 * Math.PI)
          ctx.fill()
          ctx.closePath()
        } else if (bitsType === "rounded") {
          const px = x * 20;
          const py = y * 20;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + 20 * 0.75, py);
          ctx.arcTo(px + 20, py, px + 20, py + 20 * 0.25, 20);
          ctx.lineTo(px + 20, py + 20 * 0.75);
          ctx.arcTo(px + 20, py + 20, px + 20 * 0.75, py + 20, 20 * 0.25);
          ctx.lineTo(px + 20 * 0.25, py + 20);
          ctx.lineTo(px, py + 20);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(x * 20, y * 20, 20, 20)
        }
      })
    })

    setQRMatrix(newQRMatrix)
  }


  const descargarImagen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'qr.png';
    enlace.click();
  };

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
          <input id="link" type="text" ref={textInputRef} value="https://mipaginaweb.com" />
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
            <label htmlFor="select-color">Color</label>
            <input id="select-color" type="color" value={fillCellsColor} onChange={(event) => setFillCellsColor(event.target.value)} />
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
        <canvas ref={canvasRef} width={200} height={200} style={{padding: "40px", backgroundColor: "white"}}></canvas>
        <button onClick={descargarImagen}>Descargar QR</button>
      </div>
    </>
  )
}

export default App
