import {
  museCouplingNameMap,
  createCouplingName,
  Honoka,
  Kotori,
  Nico,
  Maki,
  Rin,
  Hanayo
} from "../Muse";

describe("muse module", () => {
  describe("#museCouplingNameMap", () => {
    it("should have every name pattern of coupling.", () => {
      const memberLength = 9;

      expect(museCouplingNameMap).toHaveLength(memberLength);
      museCouplingNameMap.forEach(_ => {
        expect(_).toHaveLength(memberLength);
      });
    });

    it("should have value", () => {
      museCouplingNameMap.forEach((_, i) => {
        _.forEach((__, j) => {
          if (i === j) {
            expect(__).toBeNull();
          } else {
            expect(__).not.toBeNull();
          }
        });
      });
    });
  });

  describe("#createCouplingName", () => {
    it("ことほの", () => {
      const name = createCouplingName(Kotori, Honoka);

      expect(name).toEqual("ことほの");
    });

    it("ほのこと", () => {
      const name = createCouplingName(Honoka, Kotori);

      expect(name).toEqual("ほのこと");
    });

    it("にこまき", () => {
      const name = createCouplingName(Nico, Maki);

      expect(name).toEqual("にこまき");
    });

    it("りんぱな", () => {
      const name = createCouplingName(Rin, Hanayo);

      expect(name).toEqual("りんぱな");
    });
  });
});
