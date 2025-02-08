import { QREncodedType, QRErrorCorrectionKey, QRVersion } from "../../types/QRTypes"
import { QR_INFORMATION } from "../constants/QR_INFORMATION"

export function getQRVersion(dataLength: number, correctionLevel: QRErrorCorrectionKey, encodedType: QREncodedType): QRVersion {
  if (QR_INFORMATION[1].eccLevels[correctionLevel][encodedType] === undefined)
    throw new Error("Invalid encoded type")

  for (const version in QR_INFORMATION) {
    const versionNumber = parseInt(version) as QRVersion

    const maxDataBytes = QR_INFORMATION[versionNumber].eccLevels[correctionLevel][encodedType]
    if (dataLength / 8 <= maxDataBytes) {
      return versionNumber
    }
  }

  throw new Error("Data is too long")
}