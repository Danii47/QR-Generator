import { QRErrorCorrectionKey, QRVersion } from "../../types/QRTypes";
import { QR_INFORMATION } from "../constants/QR_INFORMATION";
import { getQRTotalBits } from "./getQRTotalBits";

export function getQRCorrectionErrorBits(version: QRVersion, errorCorrectionLevel: QRErrorCorrectionKey): { correctionBits: number, correctionBytes: number } {
  const { totalBits } = getQRTotalBits(version)
  const { dataBits, numberOfBlocksInGroupOne, numberOfBlocksInGroupTwo } = QR_INFORMATION[version].eccLevels[errorCorrectionLevel]

  const correctionBits = totalBits - dataBits
  const totalBlocks = numberOfBlocksInGroupOne + numberOfBlocksInGroupTwo

  return { correctionBits: Math.floor(correctionBits / totalBlocks), correctionBytes: Math.floor((correctionBits / 8) / totalBlocks) }
}