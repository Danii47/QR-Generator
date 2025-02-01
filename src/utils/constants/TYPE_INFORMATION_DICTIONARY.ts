import { QRDataType, QRDataTypeFlag } from "../../types/QRTypes";

export const TYPE_INFORMATION_DICTIONARY: Record<QRDataType, QRDataTypeFlag> = {
  "numeric": "0001",
  "alphanumeric": "0010",
  "byte": "0100",
  "kanji": "1000"
}