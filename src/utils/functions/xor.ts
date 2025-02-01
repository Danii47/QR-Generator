export function XOR(a: string, b: string): string {
  return (parseInt(a, 2) ^ parseInt(b, 2)).toString(2)
}