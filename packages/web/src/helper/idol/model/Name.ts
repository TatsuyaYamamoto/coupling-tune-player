class Name {
  constructor(readonly family: string, readonly given: string) {}

  public get fullName(): string {
    return `${this.family}${this.given}`;
  }
}

export default Name;
