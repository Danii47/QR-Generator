import { QRErrorCorrectionKey, QRVersion } from "../../types/QRTypes";
import { QR_INFORMATION } from "../constants/QR_INFORMATION";
import { getQRTotalBits } from "./getQRTotalBits";

export function getQRCorrectionErrorBits(version: QRVersion, errorCorrectionLevel: QRErrorCorrectionKey): { correctionBits: number, correctionBytes: number } {
  const { totalBits } = getQRTotalBits(version)
  const { dataBits, numberOfBlocksInGroupOne } = QR_INFORMATION[version].eccLevels[errorCorrectionLevel]

  const correctionBits = totalBits - dataBits

  return { correctionBits: Math.floor(correctionBits / numberOfBlocksInGroupOne), correctionBytes: Math.floor((correctionBits / 8) / numberOfBlocksInGroupOne) }
}