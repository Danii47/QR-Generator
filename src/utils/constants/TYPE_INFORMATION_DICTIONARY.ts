import { QREncodedType, QREncodedTypeFlag } from "../../types/QRTypes";

export const TYPE_INFORMATION_DICTIONARY: Record<QREncodedType, QREncodedTypeFlag> = {
  "numeric": "0001",
  "alphanumeric": "0010",
  "byte": "0100",
  "kanji": "1000"
}