import { QRVersion } from "../../types/QRTypes";
import { getQRDimensions } from "./getQRDimensions";

export function getAlignSquaresCoords(version: QRVersion): number[] {
  if (version === 1) return []
  else {
    const QRDimension = getQRDimensions(version)
    const numberOfCoords = Math.floor(version / 7) + 2

    // The first and last coordinates are always 6 and QRDimension - 7
    const coordsArray = [6, QRDimension - 7]
    const step = Math.floor((QRDimension - 13) / (numberOfCoords - 1))

    for (let i = 1; i < numberOfCoords - 1; i++) {
      coordsArray.push(6 + i * step)
    }

    return coordsArray
  }
}