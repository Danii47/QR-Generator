import { QRVersion } from "../../types/QRTypes";
import { getCoordinateGrid } from "./getCoordinateGrid";
import { getQRDimensions } from "./getQRDimensions";
import { getVersionInformation } from "./getVersionInformation";

export function getQRTotalBits(version: QRVersion): { totalBits: number, totalBytes: number } {
  const QRDimension = getQRDimensions(version)
  const totalBits = QRDimension * QRDimension 

  const positionSquaresBits = 8 * 8 * 3 // 8 * 8 one square, there are 3 squares
  const formatBits = 15 * 2 // 15 bits for format information that are repeated twice
  const zebraStripesBits = 2 * (5 + 4 * (version - 1)) // 5 bits for the first stripe and 4 bits more for the rest of the versions. There are 2 stripes

  const alignSquareBits = getCoordinateGrid(version).length * (5 * 5) // 5 * 5 bits for each align square

  const versionInformationBits = 2 * (getVersionInformation(version)?.length || 0) // 18 bits for version information if the version is 7 or higher

  let totalBitsToDataAndErrorCorrection = totalBits - (positionSquaresBits + formatBits + zebraStripesBits + alignSquareBits + versionInformationBits + 1)

  for (const coordinateGrid of getCoordinateGrid(version)) {
    if (coordinateGrid[0] === 6 || coordinateGrid[1] === 6)
      totalBitsToDataAndErrorCorrection += 5
  }

  return { totalBits: totalBitsToDataAndErrorCorrection, totalBytes: Math.floor(totalBitsToDataAndErrorCorrection / 8) }
}