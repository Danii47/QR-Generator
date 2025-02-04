import { QRVersion } from "../../types/QRTypes";
import { getAlignSquaresCoords } from "./getAlignSquares";
import { getQRDimensions } from "./getQRDimensions";

export function getCoordinateGrid(version: QRVersion) {
  const coordsArray = getAlignSquaresCoords(version)

  if (!coordsArray) return null

  const QRDimension = getQRDimensions(version)
  const grid = []

  for (let i = 0; i < coordsArray.length; i++) {
    for (let j = 0; j < coordsArray.length; j++) {
      if ((coordsArray[i] === 6 && coordsArray[j] === 6) || (coordsArray[i] === QRDimension - 7 && coordsArray[j] === 6) || (coordsArray[i] === 6 && coordsArray[j] === QRDimension - 7)) continue
      
      grid.push([coordsArray[i], coordsArray[j]])
    }
  }

  return grid
}