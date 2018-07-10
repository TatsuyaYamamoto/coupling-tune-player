import { Idols, findIdols } from "../IdolUtil";

describe("idol module", () => {
  describe("#findIdols", () => {
    it("should return a idol with a query of fullname.", () => {
      const actualIdols = findIdols("みなみことり");

      expect(actualIdols).toHaveLength(1);

      const expectedGivenNames = ["ことり"];
      actualIdols.forEach(idol => {
        expect(expectedGivenNames).toContain(idol.name.given);
      });
    });

    it("should return a idol with a query of sentence having a given name", () => {
      const actualIdols = findIdols("大宇宙スーパーアイドルにこ");

      expect(actualIdols).toHaveLength(1);

      const expectedGivenNames = ["にこ"];
      actualIdols.forEach(idol => {
        expect(expectedGivenNames).toContain(idol.name.given);
      });
    });

    it("should return multi idols with a query of sentence having 2 names", () => {
      const actualIdols = findIdols("高坂と南");

      expect(actualIdols).toHaveLength(2);

      const expectedGivenNames = ["ほのか", "ことり"];
      actualIdols.forEach(idol => {
        expect(expectedGivenNames).toContain(idol.kanaName.given);
      });
    });

    it("should return multi idols with a query of sentence having 2 names", () => {
      const actualIdols = findIdols("ことほののなかになまえはない");

      expect(actualIdols).toHaveLength(0);
    });
  });

  describe("#idols", () => {
    it("", () => {
      const numberOfMuseMember = 9;

      expect(Idols).toHaveLength(numberOfMuseMember);
    });
  });
});
