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
