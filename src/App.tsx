import { useRef, useState } from "react"
import "./App.css"
import { createStartMatrix } from "./utils/functions/createStartMatrix"
import { QRErrorCorrectionKey, QRMask, QRVersion } from "./types/QRTypes"
import { QR_INFORMATION } from "./utils/constants/QR_INFORMATION"
import { TYPE_INFORMATION_DICTIONARY } from "./utils/constants/TYPE_INFORMATION_DICTIONARY"
import { applyPattern } from "./utils/functions/applyPattern"
import { stringToBinary } from "./utils/functions/stringToBinary"
import { generateCorrectionErrorData } from "./utils/functions/generateCorrectionErrorData"
import { COMPLETE_BYTES } from "./utils/constants/COMPLETE_BYTES"
import { getQRVersion } from "./utils/functions/getQRVersion"


const MASK: QRMask = "001"

function App() {
  
  const textInputRef = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const [QRMatrix, setQRMatrix] = useState(createStartMatrix(1, "L", MASK))
  const [fillCellsColor, setFillCellsColor] = useState("black")
  
  const COLORS: Record<number, string> = {
    0: "white",
    1: fillCellsColor,
    2: "white",
    3: fillCellsColor,
    4: "white",
    5: fillCellsColor
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

    setQRMatrix(newQRMatrix)
  }


  function createQR(text: string, correctionLevel: QRErrorCorrectionKey) {
    const dataType = "byte"
    const binaryText = stringToBinary(text)

    const textLengthBinary = text.length.toString(2).padStart(8, "0")
    const finalBlock = "0000"
    const codifiedData = TYPE_INFORMATION_DICTIONARY[dataType] + textLengthBinary + binaryText + finalBlock
    
    const QRVersion = getQRVersion(codifiedData.length, correctionLevel)
    const { dataBits, numberOfBlocksInGroupOne, numberOfBlocksInGroupTwo } = QR_INFORMATION[QRVersion].eccLevels[correctionLevel]
    
    const totalDataString = codifiedData.padEnd(dataBits, COMPLETE_BYTES)

    const dataBlocks = new Array(numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo)
    const errorBlocks = new Array(numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo)
    const blockCapacitieInGroupOne = Math.floor(totalDataString.length / dataBlocks.length / 8) * 8

    for (let i = 0; i < dataBlocks.length; i++) {
      const start = i * blockCapacitieInGroupOne + (i > numberOfBlocksInGroupOne ? 8 : 0)
      const end = (i + 1) * blockCapacitieInGroupOne + (i >= numberOfBlocksInGroupOne ? 8 : 0)

      dataBlocks[i] = totalDataString.substring(start, end + (i > numberOfBlocksInGroupOne ? 8 : 0))
      errorBlocks[i] = generateCorrectionErrorData(QRVersion, correctionLevel, dataBlocks[i]).match(/.{1,8}/g)
      dataBlocks[i] = dataBlocks[i].match(/.{1,8}/g)
    }

    let dataAndCorrectionErrorString = ""

    for (let i = 0; i < dataBlocks[dataBlocks.length - 1].length; i++) {
      for (let j = 0; j < dataBlocks.length; j++) {
        if (dataBlocks[j][i])
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
        <label htmlFor="link">Escribe la URL:</label>
        <input id="link" type="text" ref={textInputRef} />
        <label htmlFor="qr-correction-level">Tipo de corrección:</label>
        <select id="qr-correction-level" name="opciones" ref={correctionLevelRef}>
          <option value="L">Muy bajo (L)</option>
          <option value="M">Bajo (M)</option>
          <option value="Q">Medio (Q)</option>
          <option value="H">Alto (H)</option>
        </select>
        <input type="color" value={fillCellsColor} onChange={(event) => setFillCellsColor(event.target.value)} />
        <button type="submit"></button>
      </form>
      <div style={{ backgroundColor: "white", padding: "20px", margin: "20px" }}>
        {
          QRMatrix.map((row, rowIndex) => { 
            return (
              <div key={rowIndex} style={{ display: "flex" }}>
                {
                  row.map((col, colIndex) => {
                    // TODO Que se pueda cambiar el color de los cuadros y el border radius, para que puedan ser redondos o con los bordes redondeados
                    return (
                      <div key={colIndex} style={{ width: "20px", height: "20px", backgroundColor: COLORS[col] }}></div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
