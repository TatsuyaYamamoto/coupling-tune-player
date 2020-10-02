/**
 *
 * @param bytes
 * @param format
 * @see https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string/9458996#9458996
 */
export const encodeBase64ImageFromArray = (
  bytes: Uint8Array,
  format: string
): string => {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return `data:${format};base64,${base64}`;
};

export function descendingComparator<T>(a: T, b: T, orderField: keyof T) {
  if (b[orderField] < a[orderField]) {
    return -1;
  }
  if (b[orderField] > a[orderField]) {
    return 1;
  }
  return 0;
}

export function getComparator<T>(
  orderType: "asc" | "desc",
  orderField: keyof T
): (a: T, b: T) => number {
  return orderType === "desc"
    ? (a, b) => descendingComparator(a, b, orderField)
    : (a, b) => -descendingComparator(a, b, orderField);
}

export function stableSort<T>(
  array: T[],
  comparator: (a: T, b: T) => number
): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
