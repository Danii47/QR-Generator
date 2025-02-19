export type QRVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40

type Binary = "0" | "1"

export type QRErrorCorrectionKey = "L" | "M" | "Q" | "H"
export type QRErrorCorrectionValue = `${Binary}${Binary}`

export type QRErrorCorrection = Record<QRErrorCorrectionKey, QRErrorCorrectionValue>

export type QRMask = `${Binary}${Binary}${Binary}`

export type QREncodedType = "numeric" | "alphanumeric" | "byte" | "kanji"
export type QREncodedTypeFlag = "0001" | "0010" | "0100" | "1000"

type QRData = {
  dataBits: number
  numberOfBlocksInGroupOne: number
  numberOfBlocksInGroupTwo: number
} & Record<QREncodedType, number>

export type QRInformation = {
  modules: `${number}x${number}`
  eccLevels: Record<QRErrorCorrectionKey, QRData>
}

type QRMatrixCell = 0 | 2 | 3 | 4 | 5

export type QRMatrixType = QRMatrixCell[][]

export type QRBitsType = "square" | "circle" | "rounded"