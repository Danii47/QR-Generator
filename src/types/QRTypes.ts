export type QRVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40

export type QRErrorCorrectionKey = "L" | "M" | "Q" | "H"
export type QRErrorCorrectionValue = "11" | "10" | "01" | "00"

export type QRErrorCorrection = Record<QRErrorCorrectionKey, QRErrorCorrectionValue>

export type QRMask = "000" | "001" | "010" | "011" | "100" | "101" | "110" | "111"

export type QRDataType = "numeric" | "alphanumeric" | "byte" | "kanji"
export type QRDataTypeFlag = "0001" | "0010" | "0100" | "1000"

type QRData = {
  dataBits: number
  numeric: number
  alphanumeric: number
  binary: number
  kanji: number
}

export type QRInformation = {
  modules: `${string}x${string}`
  eccLevels: Record<QRErrorCorrectionKey, QRData>
}