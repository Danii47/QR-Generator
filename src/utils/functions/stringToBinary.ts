// Converts string to binary
export function stringToBinary(link: string): string {
  let binaryLink = ""

  for (let i = 0; i < link.length; i++) {
    binaryLink += link.charCodeAt(i).toString(2).padStart(8, "0")
  }

  return binaryLink
}