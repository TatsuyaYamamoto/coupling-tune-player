import Name from "./Name";

export interface SchoolIdolConstructor {
  name: Name;
  kanaName: Name;
  alphabetName: Name;
  voiceActorName: string;
}

class SchoolIdol {
  readonly name: Name;
  readonly kanaName: Name;
  readonly alphabetName: Name;
  readonly voiceActorName: string;

  constructor(params: SchoolIdolConstructor) {
    this.name = params.name;
    this.kanaName = params.kanaName;
    this.alphabetName = params.alphabetName;
    this.voiceActorName = params.voiceActorName;
  }
}

export default SchoolIdol;
