import { useRef, useState } from 'react'
import './App.css'
import { createStartMatrix } from './utils/functions/createStartMatrix'
import { QRMask } from './types/QRTypes'
import { QR_INFORMATION } from './utils/constants/QR_INFORMATION'
import { TYPE_INFORMATION_DICTIONARY } from './utils/constants/TYPE_INFORMATION_DICTIONARY'

const COLORS: Record<number, string> = {
  0: "white",
  1: "black",
  2: "white",
  3: "black",
  4: "white",
  5: "black"
}

// If function returns true, the cell will be inverted
const MASKS: Record<string, (i: number, j: number) => boolean> = {
  "000": (row, column) => (row + column) % 2 === 0,
  "001": (row) => row % 2 === 0,
  "010": (_, column) => column % 3 === 0,
  "011": (row, column) => (row + column) % 3 === 0,
  "100": (row, column) => (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0,
  "101": (row, column) => ((row * column) % 2) + ((row * column) % 3) === 0,
  "110": (row, column) => (((row * column) % 2) + ((row * column) % 3)) % 2 === 0,
  "111": (row, column) => (((row + column) % 2) + ((row * column) % 3)) % 2 === 0
}

const MASK: QRMask = "001"

function App() {

  const inputRef = useRef<HTMLInputElement>(null)
  const [QRMatrix, setQRMatrix] = useState(createStartMatrix(1, "L", MASK, "byte"))

  // Fill the matrix with 
  function fillNumber(binaryString: string) {
    console.log({ binaryString, l: binaryString.length })

    setQRMatrix(prevQRMatrix => {

      const newQRMatrix = prevQRMatrix.map(row => [...row])
      let cont = false

      for (let i = newQRMatrix[0].length - 1; i >= 0; i -= 2) {
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

      // for (let i = 0; i < newQRMatrix.length; i++) {
      //   for (let j = 0; j < newQRMatrix[i].length; j++) {
      //     if (newQRMatrix[i][j] != 2 && newQRMatrix[i][j] != 3) {
      //       const mask = MASKS[MASK]
      //       if (mask(i, j)) {
      //         newQRMatrix[i][j] = newQRMatrix[i][j] === 0 || newQRMatrix[i][j] === 4 ? 5 : 4
      //       }
      //     }
      //   }
      // }

      return newQRMatrix
    })

  }

  // Converts string to binary
  function linkToBinary(link: string): string {
    let binaryLink = ""

    for (let i = 0; i < link.length; i++) {
      binaryLink += link.charCodeAt(i).toString(2).padStart(8, "0")
    }

    return binaryLink
  }

  function createQR(link: string) {
    const dataType = "byte"
    const binaryLink = linkToBinary(link)
    const binaryLinkLength = binaryLink.length.toString(2).padStart(8, "0")
    const finalBlock = "0000"

    const totalString = TYPE_INFORMATION_DICTIONARY[dataType] + binaryLinkLength + binaryLink + finalBlock

    // This bytes are used to indicate the end of the data, in this case, 0xEC and 0x11, when the data 
    const completeBytes = 0xEC.toString(2).padStart(8, "0") + 0x11.toString(2).padStart(8, "0")
    fillNumber(totalString.padEnd(QR_INFORMATION[1].eccLevels.L.dataBits, completeBytes))
  }

  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={() => {
        if (inputRef.current && inputRef.current.value) {
          createQR(inputRef.current.value)
        }
      }}></button>
      <div style={{ backgroundColor: "brown", padding: '15px' }}>
        {
          QRMatrix.map((row, rowIndex) => { 
            return (
              <div key={rowIndex} style={{ display: 'flex' }}>
                {
                  row.map((col, colIndex) => {
                    return (
                      <div key={colIndex} style={{ width: '20px', height: '20px', backgroundColor: COLORS[col] }}></div>
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
