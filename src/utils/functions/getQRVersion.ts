import { QRErrorCorrectionKey, QRVersion } from "../../types/QRTypes"
import { QR_INFORMATION } from "../constants/QR_INFORMATION"

export function getQRVersion(dataLength: number, correctionLevel: QRErrorCorrectionKey): QRVersion {
  
  for (const version in QR_INFORMATION) {
    const versionNumber = parseInt(version) as QRVersion

    const maxDataBits = QR_INFORMATION[versionNumber].eccLevels[correctionLevel].dataBits
    if (dataLength <= maxDataBits) {
      return versionNumber
    }
  }

  throw new Error("Data is too long")
}