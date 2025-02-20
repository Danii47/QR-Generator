import { QRInformation } from "../../types/QRTypes"

// TODO: all versions <QRVersion> should be imported from the types
export const QR_INFORMATION: Record<number, QRInformation> = {
  1: {
    modules: "21x21",
    eccLevels: {
      "L": { dataBits: 152, numeric: 41, alphanumeric: 25, byte: 17, kanji: 10, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 128, numeric: 34, alphanumeric: 20, byte: 14, kanji: 8, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 104, numeric: 27, alphanumeric: 16, byte: 11, kanji: 7, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "H": { dataBits: 72, numeric: 17, alphanumeric: 10, byte: 7, kanji: 4, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 }
    }
  },
  2: {
    modules: "25x25",
    eccLevels: {
      "L": { dataBits: 272, numeric: 77, alphanumeric: 47, byte: 32, kanji: 20, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 224, numeric: 63, alphanumeric: 38, byte: 26, kanji: 16, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 176, numeric: 48, alphanumeric: 29, byte: 20, kanji: 12, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "H": { dataBits: 128, numeric: 34, alphanumeric: 20, byte: 14, kanji: 8, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 }
    }
  },
  3: {
    modules: "29x29",
    eccLevels: {
      "L": { dataBits: 440, numeric: 127, alphanumeric: 77, byte: 53, kanji: 32, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 352, numeric: 101, alphanumeric: 61, byte: 42, kanji: 26, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 272, numeric: 77, alphanumeric: 47, byte: 32, kanji: 20, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "H": { dataBits: 208, numeric: 58, alphanumeric: 35, byte: 24, kanji: 15, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 }
    }
  },
  4: {
    modules: "33x33",
    eccLevels: {
      "L": { dataBits: 640, numeric: 187, alphanumeric: 114, byte: 78, kanji: 48, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 512, numeric: 149, alphanumeric: 90, byte: 62, kanji: 38, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 384, numeric: 111, alphanumeric: 67, byte: 46, kanji: 28, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "H": { dataBits: 288, numeric: 82, alphanumeric: 50, byte: 34, kanji: 21, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 }
    }
  },
  5: {
    modules: "37x37",
    eccLevels: {
      "L": { dataBits: 864, numeric: 255, alphanumeric: 154, byte: 106, kanji: 65, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 688, numeric: 202, alphanumeric: 122, byte: 84, kanji: 52, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 496, numeric: 144, alphanumeric: 87, byte: 60, kanji: 37, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 2 },
      "H": { dataBits: 368, numeric: 106, alphanumeric: 64, byte: 44, kanji: 27, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 2 }
    }
  },
  6: {
    modules: "41x41",
    eccLevels: {
      "L": { dataBits: 1088, numeric: 322, alphanumeric: 195, byte: 134, kanji: 82, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 864, numeric: 255, alphanumeric: 154, byte: 106, kanji: 65, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 608, numeric: 178, alphanumeric: 108, byte: 74, kanji: 45, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 },
      "H": { dataBits: 480, numeric: 139, alphanumeric: 84, byte: 58, kanji: 36, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 }
    }
  },
  7: {
    modules: "45x45",
    eccLevels: {
      "L": { dataBits: 1248, numeric: 370, alphanumeric: 224, byte: 154, kanji: 95, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 992, numeric: 293, alphanumeric: 178, byte: 122, kanji: 75, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 },
      "Q": { dataBits: 704, numeric: 207, alphanumeric: 125, byte: 86, kanji: 53, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 4 },
      "H": { dataBits: 528, numeric: 154, alphanumeric: 93, byte: 64, kanji: 39, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 1 }
    }
  },
  8: {
    modules: "49x49",
    eccLevels: {
      "L": { dataBits: 1552, numeric: 461, alphanumeric: 279, byte: 192, kanji: 118, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 1232, numeric: 365, alphanumeric: 221, byte: 152, kanji: 93, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 2 },
      "Q": { dataBits: 880, numeric: 259, alphanumeric: 157, byte: 108, kanji: 66, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 2 },
      "H": { dataBits: 688, numeric: 202, alphanumeric: 122, byte: 84, kanji: 52, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 2 }
    }
  },
  9: {
    modules: "53x53",
    eccLevels: {
      "L": { dataBits: 1856, numeric: 552, alphanumeric: 335, byte: 230, kanji: 141, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 1456, numeric: 432, alphanumeric: 262, byte: 180, kanji: 111, numberOfBlocksInGroupOne: 3, numberOfBlocksInGroupTwo: 2 },
      "Q": { dataBits: 1056, numeric: 312, alphanumeric: 189, byte: 130, kanji: 80, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 4 },
      "H": { dataBits: 800, numeric: 235, alphanumeric: 143, byte: 98, kanji: 60, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 4 }
    }
  },
  10: {
    modules: "57x57",
    eccLevels: {
      "L": { dataBits: 2192, numeric: 652, alphanumeric: 395, byte: 271, kanji: 167, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 2 },
      "M": { dataBits: 1728, numeric: 513, alphanumeric: 311, byte: 213, kanji: 131, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 1 },
      "Q": { dataBits: 1232, numeric: 364, alphanumeric: 221, byte: 151, kanji: 93, numberOfBlocksInGroupOne: 6, numberOfBlocksInGroupTwo: 2 },
      "H": { dataBits: 976, numeric: 288, alphanumeric: 174, byte: 119, kanji: 74, numberOfBlocksInGroupOne: 6, numberOfBlocksInGroupTwo: 2 }
    }
  },
  11: {
    modules: "61x61",
    eccLevels: {
      "L": { dataBits: 2592, numeric: 772, alphanumeric: 468, byte: 321, kanji: 198, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 2032, numeric: 604, alphanumeric: 366, byte: 251, kanji: 155, numberOfBlocksInGroupOne: 1, numberOfBlocksInGroupTwo: 4 },
      "Q": { dataBits: 1440, numeric: 427, alphanumeric: 259, byte: 177, kanji: 109, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 4 },
      "H": { dataBits: 1120, numeric: 331, alphanumeric: 200, byte: 137, kanji: 85, numberOfBlocksInGroupOne: 3, numberOfBlocksInGroupTwo: 8 }
    }
  },
  12: {
    modules: "65x65",
    eccLevels: {
      "L": { dataBits: 2960, numeric: 883, alphanumeric: 535, byte: 367, kanji: 226, numberOfBlocksInGroupOne: 2, numberOfBlocksInGroupTwo: 2 },
      "M": { dataBits: 2320, numeric: 691, alphanumeric: 419, byte: 287, kanji: 177, numberOfBlocksInGroupOne: 6, numberOfBlocksInGroupTwo: 2 },
      "Q": { dataBits: 1648, numeric: 489, alphanumeric: 296, byte: 203, kanji: 125, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 6 },
      "H": { dataBits: 1264, numeric: 374, alphanumeric: 227, byte: 155, kanji: 96, numberOfBlocksInGroupOne: 7, numberOfBlocksInGroupTwo: 4 }
    }
  },
  13: {
    modules: "69x69",
    eccLevels: {
      "L": { dataBits: 3424, numeric: 883, alphanumeric: 535, byte: 425, kanji: 226, numberOfBlocksInGroupOne: 4, numberOfBlocksInGroupTwo: 0 },
      "M": { dataBits: 2672, numeric: 691, alphanumeric: 419, byte: 331, kanji: 177, numberOfBlocksInGroupOne: 8, numberOfBlocksInGroupTwo: 1 },
      "Q": { dataBits: 1952, numeric: 489, alphanumeric: 296, byte: 241, kanji: 125, numberOfBlocksInGroupOne: 8, numberOfBlocksInGroupTwo: 4 },
      "H": { dataBits: 1440, numeric: 374, alphanumeric: 227, byte: 177, kanji: 96, numberOfBlocksInGroupOne: 12, numberOfBlocksInGroupTwo: 4 }
    }
  }
}