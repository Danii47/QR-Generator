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

const COLORS: Record<number, string> = {
  0: "white",
  1: "black",
  2: "white",
  3: "black",
  4: "white",
  5: "black"
}



const MASK: QRMask = "001"

function App() {

  const textInputRef = useRef<HTMLInputElement>(null)
  const correctionLevelRef = useRef<HTMLSelectElement>(null)
  const [QRMatrix, setQRMatrix] = useState(createStartMatrix(1, "L", MASK))


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

    const dataTotalBits = QR_INFORMATION[QRVersion].eccLevels[correctionLevel].dataBits

    const totalDataString = codifiedData.padEnd(dataTotalBits, COMPLETE_BYTES)
    const totalCorrectionErrorDataString = generateCorrectionErrorData(QRVersion, correctionLevel, totalDataString)
    
    const dataAndCorrectionErrorString = totalDataString + totalCorrectionErrorDataString

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
        <button type="submit"></button>
      </form>
      <div style={{ backgroundColor: "white", padding: "20px", margin: "20px" }}>
        {
          QRMatrix.map((row, rowIndex) => { 
            return (
              <div key={rowIndex} style={{ display: "flex" }}>
                {
                  row.map((col, colIndex) => {
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
