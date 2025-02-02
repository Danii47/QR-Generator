import { QRInformation, QRVersion } from "../../types/QRTypes";

// TODO: all versions <QRVersion> should be imported from the types
export const QR_INFORMATION: Record<QRVersion, QRInformation> = {
  1: {
    modules: "21x21",
    eccLevels: {
      "L": { dataBits: 152, numeric: 41, alphanumeric: 25, binary: 17, kanji: 10 },
      "M": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 },
      "Q": { dataBits: 104, numeric: 27, alphanumeric: 16, binary: 11, kanji: 7 },
      "H": { dataBits: 72, numeric: 17, alphanumeric: 10, binary: 7, kanji: 4 }
    }
  },
  2: {
    modules: "25x25",
    eccLevels: {
      "L": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "M": { dataBits: 224, numeric: 63, alphanumeric: 38, binary: 26, kanji: 16 },
      "Q": { dataBits: 176, numeric: 48, alphanumeric: 29, binary: 20, kanji: 12 },
      "H": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 }
    }
  },
  3: {
    modules: "29x29",
    eccLevels: {
      "L": { dataBits: 440, numeric: 127, alphanumeric: 77, binary: 53, kanji: 32 },
      "M": { dataBits: 352, numeric: 101, alphanumeric: 61, binary: 42, kanji: 26 },
      "Q": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "H": { dataBits: 208, numeric: 58, alphanumeric: 35, binary: 24, kanji: 15 }
    }
  },
  4: {
    modules: "33x33",
    eccLevels: {
      "L": { dataBits: 640, numeric: 187, alphanumeric: 114, binary: 78, kanji: 48 },
      "M": { dataBits: 512, numeric: 149, alphanumeric: 90, binary: 62, kanji: 38 },
      "Q": { dataBits: 384, numeric: 111, alphanumeric: 67, binary: 46, kanji: 28 },
      "H": { dataBits: 288, numeric: 82, alphanumeric: 50, binary: 34, kanji: 21 }
    }
  },
  5: {
    modules: "37x37",
    eccLevels: {
      "L": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "M": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 },
      "Q": { dataBits: 496, numeric: 144, alphanumeric: 87, binary: 60, kanji: 37 },
      "H": { dataBits: 368, numeric: 106, alphanumeric: 64, binary: 44, kanji: 27 }
    }
  },
  6: {
    modules: "41x41",
    eccLevels: {
      "L": { dataBits: 1088, numeric: 322, alphanumeric: 195, binary: 134, kanji: 82 },
      "M": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "Q": { dataBits: 608, numeric: 178, alphanumeric: 108, binary: 74, kanji: 45 },
      "H": { dataBits: 480, numeric: 139, alphanumeric: 84, binary: 58, kanji: 36 }
    }
  },
  7: {
    modules: "45x45",
    eccLevels: {
      "L": { dataBits: 1248, numeric: 370, alphanumeric: 224, binary: 154, kanji: 95 },
      "M": { dataBits: 992, numeric: 293, alphanumeric: 178, binary: 122, kanji: 75 },
      "Q": { dataBits: 704, numeric: 207, alphanumeric: 125, binary: 86, kanji: 53 },
      "H": { dataBits: 528, numeric: 154, alphanumeric: 93, binary: 64, kanji: 39 }
    }
  },
  8: {
    modules: "49x49",
    eccLevels: {
      "L": { dataBits: 1552, numeric: 461, alphanumeric: 279, binary: 192, kanji: 118 },
      "M": { dataBits: 1232, numeric: 365, alphanumeric: 221, binary: 152, kanji: 93 },
      "Q": { dataBits: 880, numeric: 259, alphanumeric: 157, binary: 108, kanji: 66 },
      "H": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 }
    }
  },
  9: {
    modules: "53x53",
    eccLevels: {
      "L": { dataBits: 1856, numeric: 552, alphanumeric: 335, binary: 230, kanji: 141 },
      "M": { dataBits: 1456, numeric: 432, alphanumeric: 262, binary: 180, kanji: 111 },
      "Q": { dataBits: 1056, numeric: 312, alphanumeric: 189, binary: 130, kanji: 80 },
      "H": { dataBits: 800, numeric: 235, alphanumeric: 143, binary: 98, kanji: 60 }
    }
  },
  10: {
    modules: "57x57",
    eccLevels: {
      "L": { dataBits: 2192, numeric: 652, alphanumeric: 395, binary: 271, kanji: 167 },
      "M": { dataBits: 1728, numeric: 513, alphanumeric: 311, binary: 213, kanji: 131 },
      "Q": { dataBits: 1232, numeric: 364, alphanumeric: 221, binary: 151, kanji: 93 },
      "H": { dataBits: 976, numeric: 288, alphanumeric: 174, binary: 119, kanji: 74 }
    }
  },



  11: {
    modules: "21x21",
    eccLevels: {
      "L": { dataBits: 152, numeric: 41, alphanumeric: 25, binary: 17, kanji: 10 },
      "M": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 },
      "Q": { dataBits: 104, numeric: 27, alphanumeric: 16, binary: 11, kanji: 7 },
      "H": { dataBits: 72, numeric: 17, alphanumeric: 10, binary: 7, kanji: 4 }
    }
  },
  12: {
    modules: "25x25",
    eccLevels: {
      "L": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "M": { dataBits: 224, numeric: 63, alphanumeric: 38, binary: 26, kanji: 16 },
      "Q": { dataBits: 176, numeric: 48, alphanumeric: 29, binary: 20, kanji: 12 },
      "H": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 }
    }
  },
  13: {
    modules: "29x29",
    eccLevels: {
      "L": { dataBits: 440, numeric: 127, alphanumeric: 77, binary: 53, kanji: 32 },
      "M": { dataBits: 352, numeric: 101, alphanumeric: 61, binary: 42, kanji: 26 },
      "Q": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "H": { dataBits: 208, numeric: 58, alphanumeric: 35, binary: 24, kanji: 15 }
    }
  },
  14: {
    modules: "33x33",
    eccLevels: {
      "L": { dataBits: 640, numeric: 187, alphanumeric: 114, binary: 78, kanji: 48 },
      "M": { dataBits: 512, numeric: 149, alphanumeric: 90, binary: 62, kanji: 38 },
      "Q": { dataBits: 384, numeric: 111, alphanumeric: 67, binary: 46, kanji: 28 },
      "H": { dataBits: 288, numeric: 82, alphanumeric: 50, binary: 34, kanji: 21 }
    }
  },
  15: {
    modules: "37x37",
    eccLevels: {
      "L": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "M": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 },
      "Q": { dataBits: 496, numeric: 144, alphanumeric: 87, binary: 60, kanji: 37 },
      "H": { dataBits: 368, numeric: 106, alphanumeric: 64, binary: 44, kanji: 27 }
    }
  },
  16: {
    modules: "41x41",
    eccLevels: {
      "L": { dataBits: 1088, numeric: 322, alphanumeric: 195, binary: 134, kanji: 82 },
      "M": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "Q": { dataBits: 608, numeric: 178, alphanumeric: 108, binary: 74, kanji: 45 },
      "H": { dataBits: 480, numeric: 139, alphanumeric: 84, binary: 58, kanji: 36 }
    }
  },
  17: {
    modules: "45x45",
    eccLevels: {
      "L": { dataBits: 1248, numeric: 370, alphanumeric: 224, binary: 154, kanji: 95 },
      "M": { dataBits: 992, numeric: 293, alphanumeric: 178, binary: 122, kanji: 75 },
      "Q": { dataBits: 704, numeric: 207, alphanumeric: 125, binary: 86, kanji: 53 },
      "H": { dataBits: 528, numeric: 154, alphanumeric: 93, binary: 64, kanji: 39 }
    }
  },
  18: {
    modules: "49x49",
    eccLevels: {
      "L": { dataBits: 1552, numeric: 461, alphanumeric: 279, binary: 192, kanji: 118 },
      "M": { dataBits: 1232, numeric: 365, alphanumeric: 221, binary: 152, kanji: 93 },
      "Q": { dataBits: 880, numeric: 259, alphanumeric: 157, binary: 108, kanji: 66 },
      "H": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 }
    }
  },
  19: {
    modules: "53x53",
    eccLevels: {
      "L": { dataBits: 1856, numeric: 552, alphanumeric: 335, binary: 230, kanji: 141 },
      "M": { dataBits: 1456, numeric: 432, alphanumeric: 262, binary: 180, kanji: 111 },
      "Q": { dataBits: 1056, numeric: 312, alphanumeric: 189, binary: 130, kanji: 80 },
      "H": { dataBits: 800, numeric: 235, alphanumeric: 143, binary: 98, kanji: 60 }
    }
  },
  20: {
    modules: "57x57",
    eccLevels: {
      "L": { dataBits: 2192, numeric: 652, alphanumeric: 395, binary: 271, kanji: 167 },
      "M": { dataBits: 1728, numeric: 513, alphanumeric: 311, binary: 213, kanji: 131 },
      "Q": { dataBits: 1232, numeric: 364, alphanumeric: 221, binary: 151, kanji: 93 },
      "H": { dataBits: 976, numeric: 288, alphanumeric: 174, binary: 119, kanji: 74 }
    }
  },


  21: {
    modules: "21x21",
    eccLevels: {
      "L": { dataBits: 152, numeric: 41, alphanumeric: 25, binary: 17, kanji: 10 },
      "M": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 },
      "Q": { dataBits: 104, numeric: 27, alphanumeric: 16, binary: 11, kanji: 7 },
      "H": { dataBits: 72, numeric: 17, alphanumeric: 10, binary: 7, kanji: 4 }
    }
  },
  22: {
    modules: "25x25",
    eccLevels: {
      "L": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "M": { dataBits: 224, numeric: 63, alphanumeric: 38, binary: 26, kanji: 16 },
      "Q": { dataBits: 176, numeric: 48, alphanumeric: 29, binary: 20, kanji: 12 },
      "H": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 }
    }
  },
  23: {
    modules: "29x29",
    eccLevels: {
      "L": { dataBits: 440, numeric: 127, alphanumeric: 77, binary: 53, kanji: 32 },
      "M": { dataBits: 352, numeric: 101, alphanumeric: 61, binary: 42, kanji: 26 },
      "Q": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "H": { dataBits: 208, numeric: 58, alphanumeric: 35, binary: 24, kanji: 15 }
    }
  },
  24: {
    modules: "33x33",
    eccLevels: {
      "L": { dataBits: 640, numeric: 187, alphanumeric: 114, binary: 78, kanji: 48 },
      "M": { dataBits: 512, numeric: 149, alphanumeric: 90, binary: 62, kanji: 38 },
      "Q": { dataBits: 384, numeric: 111, alphanumeric: 67, binary: 46, kanji: 28 },
      "H": { dataBits: 288, numeric: 82, alphanumeric: 50, binary: 34, kanji: 21 }
    }
  },
  25: {
    modules: "37x37",
    eccLevels: {
      "L": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "M": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 },
      "Q": { dataBits: 496, numeric: 144, alphanumeric: 87, binary: 60, kanji: 37 },
      "H": { dataBits: 368, numeric: 106, alphanumeric: 64, binary: 44, kanji: 27 }
    }
  },
  26: {
    modules: "41x41",
    eccLevels: {
      "L": { dataBits: 1088, numeric: 322, alphanumeric: 195, binary: 134, kanji: 82 },
      "M": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "Q": { dataBits: 608, numeric: 178, alphanumeric: 108, binary: 74, kanji: 45 },
      "H": { dataBits: 480, numeric: 139, alphanumeric: 84, binary: 58, kanji: 36 }
    }
  },
  27: {
    modules: "45x45",
    eccLevels: {
      "L": { dataBits: 1248, numeric: 370, alphanumeric: 224, binary: 154, kanji: 95 },
      "M": { dataBits: 992, numeric: 293, alphanumeric: 178, binary: 122, kanji: 75 },
      "Q": { dataBits: 704, numeric: 207, alphanumeric: 125, binary: 86, kanji: 53 },
      "H": { dataBits: 528, numeric: 154, alphanumeric: 93, binary: 64, kanji: 39 }
    }
  },
  28: {
    modules: "49x49",
    eccLevels: {
      "L": { dataBits: 1552, numeric: 461, alphanumeric: 279, binary: 192, kanji: 118 },
      "M": { dataBits: 1232, numeric: 365, alphanumeric: 221, binary: 152, kanji: 93 },
      "Q": { dataBits: 880, numeric: 259, alphanumeric: 157, binary: 108, kanji: 66 },
      "H": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 }
    }
  },
  29: {
    modules: "53x53",
    eccLevels: {
      "L": { dataBits: 1856, numeric: 552, alphanumeric: 335, binary: 230, kanji: 141 },
      "M": { dataBits: 1456, numeric: 432, alphanumeric: 262, binary: 180, kanji: 111 },
      "Q": { dataBits: 1056, numeric: 312, alphanumeric: 189, binary: 130, kanji: 80 },
      "H": { dataBits: 800, numeric: 235, alphanumeric: 143, binary: 98, kanji: 60 }
    }
  },
  30: {
    modules: "57x57",
    eccLevels: {
      "L": { dataBits: 2192, numeric: 652, alphanumeric: 395, binary: 271, kanji: 167 },
      "M": { dataBits: 1728, numeric: 513, alphanumeric: 311, binary: 213, kanji: 131 },
      "Q": { dataBits: 1232, numeric: 364, alphanumeric: 221, binary: 151, kanji: 93 },
      "H": { dataBits: 976, numeric: 288, alphanumeric: 174, binary: 119, kanji: 74 }
    }
  },
  31: {
    modules: "21x21",
    eccLevels: {
      "L": { dataBits: 152, numeric: 41, alphanumeric: 25, binary: 17, kanji: 10 },
      "M": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 },
      "Q": { dataBits: 104, numeric: 27, alphanumeric: 16, binary: 11, kanji: 7 },
      "H": { dataBits: 72, numeric: 17, alphanumeric: 10, binary: 7, kanji: 4 }
    }
  },
  32: {
    modules: "25x25",
    eccLevels: {
      "L": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "M": { dataBits: 224, numeric: 63, alphanumeric: 38, binary: 26, kanji: 16 },
      "Q": { dataBits: 176, numeric: 48, alphanumeric: 29, binary: 20, kanji: 12 },
      "H": { dataBits: 128, numeric: 34, alphanumeric: 20, binary: 14, kanji: 8 }
    }
  },
  33: {
    modules: "29x29",
    eccLevels: {
      "L": { dataBits: 440, numeric: 127, alphanumeric: 77, binary: 53, kanji: 32 },
      "M": { dataBits: 352, numeric: 101, alphanumeric: 61, binary: 42, kanji: 26 },
      "Q": { dataBits: 272, numeric: 77, alphanumeric: 47, binary: 32, kanji: 20 },
      "H": { dataBits: 208, numeric: 58, alphanumeric: 35, binary: 24, kanji: 15 }
    }
  },
  34: {
    modules: "33x33",
    eccLevels: {
      "L": { dataBits: 640, numeric: 187, alphanumeric: 114, binary: 78, kanji: 48 },
      "M": { dataBits: 512, numeric: 149, alphanumeric: 90, binary: 62, kanji: 38 },
      "Q": { dataBits: 384, numeric: 111, alphanumeric: 67, binary: 46, kanji: 28 },
      "H": { dataBits: 288, numeric: 82, alphanumeric: 50, binary: 34, kanji: 21 }
    }
  },
  35: {
    modules: "37x37",
    eccLevels: {
      "L": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "M": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 },
      "Q": { dataBits: 496, numeric: 144, alphanumeric: 87, binary: 60, kanji: 37 },
      "H": { dataBits: 368, numeric: 106, alphanumeric: 64, binary: 44, kanji: 27 }
    }
  },
  36: {
    modules: "41x41",
    eccLevels: {
      "L": { dataBits: 1088, numeric: 322, alphanumeric: 195, binary: 134, kanji: 82 },
      "M": { dataBits: 864, numeric: 255, alphanumeric: 154, binary: 106, kanji: 65 },
      "Q": { dataBits: 608, numeric: 178, alphanumeric: 108, binary: 74, kanji: 45 },
      "H": { dataBits: 480, numeric: 139, alphanumeric: 84, binary: 58, kanji: 36 }
    }
  },
  37: {
    modules: "45x45",
    eccLevels: {
      "L": { dataBits: 1248, numeric: 370, alphanumeric: 224, binary: 154, kanji: 95 },
      "M": { dataBits: 992, numeric: 293, alphanumeric: 178, binary: 122, kanji: 75 },
      "Q": { dataBits: 704, numeric: 207, alphanumeric: 125, binary: 86, kanji: 53 },
      "H": { dataBits: 528, numeric: 154, alphanumeric: 93, binary: 64, kanji: 39 }
    }
  },
  38: {
    modules: "49x49",
    eccLevels: {
      "L": { dataBits: 1552, numeric: 461, alphanumeric: 279, binary: 192, kanji: 118 },
      "M": { dataBits: 1232, numeric: 365, alphanumeric: 221, binary: 152, kanji: 93 },
      "Q": { dataBits: 880, numeric: 259, alphanumeric: 157, binary: 108, kanji: 66 },
      "H": { dataBits: 688, numeric: 202, alphanumeric: 122, binary: 84, kanji: 52 }
    }
  },
  39: {
    modules: "53x53",
    eccLevels: {
      "L": { dataBits: 1856, numeric: 552, alphanumeric: 335, binary: 230, kanji: 141 },
      "M": { dataBits: 1456, numeric: 432, alphanumeric: 262, binary: 180, kanji: 111 },
      "Q": { dataBits: 1056, numeric: 312, alphanumeric: 189, binary: 130, kanji: 80 },
      "H": { dataBits: 800, numeric: 235, alphanumeric: 143, binary: 98, kanji: 60 }
    }
  },
  40: {
    modules: "57x57",
    eccLevels: {
      "L": { dataBits: 2192, numeric: 652, alphanumeric: 395, binary: 271, kanji: 167 },
      "M": { dataBits: 1728, numeric: 513, alphanumeric: 311, binary: 213, kanji: 131 },
      "Q": { dataBits: 1232, numeric: 364, alphanumeric: 221, binary: 151, kanji: 93 },
      "H": { dataBits: 976, numeric: 288, alphanumeric: 174, binary: 119, kanji: 74 }
    }
  }
}