import Name from "./Name";

export type GroupName = "muse" | "aqours";

export interface SchoolIdolConstructor {
  name: Name;
  kanaName: Name;
  alphabetName: Name;
  voiceActorName: string;
  groupName: GroupName;
}

class SchoolIdol {
  readonly name: Name;
  readonly kanaName: Name;
  readonly alphabetName: Name;
  readonly voiceActorName: string;
  readonly groupName: GroupName;

  constructor(params: SchoolIdolConstructor) {
    this.name = params.name;
    this.kanaName = params.kanaName;
    this.alphabetName = params.alphabetName;
    this.voiceActorName = params.voiceActorName;
    this.groupName = params.groupName;
  }
}

export default SchoolIdol;
