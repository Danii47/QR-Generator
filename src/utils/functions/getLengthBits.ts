import { QREncodedType, QRVersion } from "../../types/QRTypes"

export function getLengthBits(version: QRVersion, encodedType: QREncodedType) {
  switch (encodedType) {
    case "numeric":
      if (version <= 9) return 10
      if (version <= 26) return 12
      return 14
    case "alphanumeric":
      if (version <= 9) return 9
      if (version <= 26) return 11
      return 13
    case "byte":
      if (version <= 9) return 8
      if (version <= 26) return 16
      return 16
    case "kanji":
      if (version <= 9) return 8
      if (version <= 26) return 10
      return 12
    default:
      throw new Error("Invalid encoded type")
  }
}