import { QRVersion } from "../../types/QRTypes"

export function getQRDimensions(version: QRVersion): number {
  return version * 4 + 17
}