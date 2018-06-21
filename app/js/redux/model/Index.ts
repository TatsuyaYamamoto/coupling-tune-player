class Index {
  readonly value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new Error("");
    }

    this.value = value;
  }

  public equals(value: number | Index) {
    const target = typeof value === "number" ? value : value.value;

    return this.value === value;
  }

  protected isValid(value: number): boolean {
    if (!Number.isInteger(value)) {
      return false;
    }

    if (value < 0) {
      return false;
    }

    return true;
  }
}

export default Index;
