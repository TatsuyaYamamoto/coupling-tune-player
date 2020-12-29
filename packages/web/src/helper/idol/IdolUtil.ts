import SchoolIdol from "./model/SchoolIdol";
import {
  Honoka,
  Eri,
  Kotori,
  Umi,
  Rin,
  Maki,
  Nozomi,
  Hanayo,
  Nico,
  museCouplingNameMap,
  getIndex as getIndexFromMuse,
} from "./Muse";
import {
  Chika,
  Riko,
  Kanan,
  Dia,
  You,
  Yoshiko,
  Hanamaru,
  Mari,
  Ruby,
  aqoursCouplingNameMap,
  getIndex as getIndexFromAqours,
} from "./Aqours";

export const Idols = [
  // muse
  Honoka,
  Eri,
  Kotori,
  Umi,
  Rin,
  Maki,
  Nozomi,
  Hanayo,
  Nico,
  // aqours
  Chika,
  Riko,
  Kanan,
  Dia,
  You,
  Yoshiko,
  Hanamaru,
  Mari,
  Ruby,
];

function findIdols(
  query: string,
  candidates: SchoolIdol[] = Idols
): SchoolIdol[] {
  const c: SchoolIdol[] = [];
  let maxPoint = 0;

  candidates.forEach((idol) => {
    let point = 0;

    if (query.indexOf(idol.name.given) !== -1) {
      point += 1;
    }

    if (query.indexOf(idol.name.family) !== -1) {
      point += 1;
    }

    if (query.indexOf(idol.kanaName.given) !== -1) {
      point += 1;
    }

    if (query.indexOf(idol.kanaName.family) !== -1) {
      point += 1;
    }

    if (query.indexOf(idol.alphabetName.given) !== -1) {
      point += 1;
    }

    if (query.indexOf(idol.alphabetName.given) !== -1) {
      point += 1;
    }

    if (maxPoint < point) {
      // Update max point
      maxPoint = point;

      // Clear candidate list.
      c.splice(0, c.length);

      c.push(idol);
    } else if (maxPoint === point) {
      c.push(idol);
    }
  });

  if (maxPoint === 0) {
    return [];
  }

  return c;
}

/**
 * Return coupling name with idol's id.
 *
 * @returns {string | null}
 */
function createCouplingName(
  first: SchoolIdol,
  second: SchoolIdol
): string | null {
  if (first.groupName !== second.groupName) {
    return null;
  }

  if (first.groupName === "muse") {
    const fisrtMemberIndex = getIndexFromMuse(first);
    const secondMemberIndex = getIndexFromMuse(second);

    return museCouplingNameMap[fisrtMemberIndex][secondMemberIndex] || null;
  }

  if (first.groupName === "aqours") {
    const fisrtMemberIndex = getIndexFromAqours(first);
    const secondMemberIndex = getIndexFromAqours(second);

    return aqoursCouplingNameMap[fisrtMemberIndex][secondMemberIndex] || null;
  }

  return null;
}

export { findIdols, createCouplingName };
