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
  Nico
} from "./Muse";

export const Idols = [
  Honoka,
  Eri,
  Kotori,
  Umi,
  Rin,
  Maki,
  Nozomi,
  Hanayo,
  Nico
];

function findIdols(
  query: string,
  candidates: SchoolIdol[] = Idols
): SchoolIdol[] {
  const c: SchoolIdol[] = [];
  let maxPoint = 0;

  candidates.forEach(idol => {
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

export { findIdols };
