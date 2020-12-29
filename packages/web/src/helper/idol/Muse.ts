/**
 * @fileOverview muse.
 */
import SchoolIdol from "./model/SchoolIdol";
import Name from "./model/Name";

export const Honoka = new SchoolIdol({
  name: new Name("高坂", "穂乃果"),
  kanaName: new Name("こうさか", "ほのか"),
  alphabetName: new Name("kosaka", "honoka"),
  voiceActorName: "新田恵海",
  groupName: "muse",
});

export const Kotori = new SchoolIdol({
  name: new Name("南", "ことり"),
  kanaName: new Name("みなみ", "ことり"),
  alphabetName: new Name("minami", "kotori"),
  voiceActorName: "内田彩",
  groupName: "muse",
});

export const Umi = new SchoolIdol({
  name: new Name("園田", "海未"),
  kanaName: new Name("そのだ", "うみ"),
  alphabetName: new Name("sonoda", "umi"),
  voiceActorName: "三森すずこ",
  groupName: "muse",
});

export const Eri = new SchoolIdol({
  name: new Name("絢瀬", "絵里"),
  kanaName: new Name("あやせ", "えり"),
  alphabetName: new Name("ayase", "eli"),
  voiceActorName: "南條愛乃",
  groupName: "muse",
});

export const Nozomi = new SchoolIdol({
  name: new Name("東條", "希"),
  kanaName: new Name("とうじょう", "のぞみ"),
  alphabetName: new Name("tojo", "nozomi"),
  voiceActorName: "楠田亜衣奈",
  groupName: "muse",
});

export const Nico = new SchoolIdol({
  name: new Name("矢澤", "にこ"),
  kanaName: new Name("やざわ", "にこ"),
  alphabetName: new Name("yazawa", "nico"),
  voiceActorName: "徳井青空",
  groupName: "muse",
});

export const Maki = new SchoolIdol({
  name: new Name("西木野", "真姫"),
  kanaName: new Name("にしきの", "まき"),
  alphabetName: new Name("nishikino", "maki"),
  voiceActorName: "Pile",
  groupName: "muse",
});

export const Rin = new SchoolIdol({
  name: new Name("星空", "凛"),
  kanaName: new Name("ほしぞら", "りん"),
  alphabetName: new Name("hoshizora", "rin"),
  voiceActorName: "飯田里穂",
  groupName: "muse",
});

export const Hanayo = new SchoolIdol({
  name: new Name("小泉", "花陽"),
  kanaName: new Name("こいずみ", "はなよ"),
  alphabetName: new Name("koizumi", "hanayo"),
  voiceActorName: "久保ユリカ",
  groupName: "muse",
});

export function getIndex(member: SchoolIdol): number {
  if (member === Honoka) {
    return 0;
  }

  if (member === Eri) {
    return 1;
  }

  if (member === Kotori) {
    return 2;
  }

  if (member === Umi) {
    return 3;
  }

  if (member === Rin) {
    return 4;
  }

  if (member === Maki) {
    return 5;
  }

  if (member === Nozomi) {
    return 6;
  }

  if (member === Hanayo) {
    return 7;
  }

  if (member === Nico) {
    return 8;
  }

  throw new Error("Unexpected error. Could not find any member.");
}

/**
 * @link https://dic.pixiv.net/a/%E3%83%A9%E3%83%96%E3%83%A9%E3%82%A4%E3%83%96%21%E3%81%AE%E3%82%AB%E3%83%83%E3%83%97%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%BF%E3%82%B0%E4%B8%80%E8%A6%A7
 */
export const museCouplingNameMap = [
  /* "穂乃果" */
  [
    null,
    "ほのえり",
    "ほのこと",
    "ほのうみ",
    "ほのりん",
    "ほのまき☆",
    "ほののぞ",
    "ほのぱな",
    "ほのにこ",
  ],

  /* 絵里 */
  [
    "えりほの",
    null,
    "えりこと",
    "えりうみ",
    "えりりん",
    "えりまき",
    "えりのぞ",
    "えりぱな",
    "えりにこ",
  ],

  /* ことり */
  [
    "ことほの",
    "ことえり",
    null,
    "ことうみ",
    "ことりん",
    "ことまき",
    "ことのぞ",
    "ことぱな",
    "ことにこ",
  ],

  /* 海未 */
  [
    "うみほの",
    "うみえり",
    "うみこと",
    null,
    "うみりん",
    "うみまき☆",
    "うみのぞ",
    "うみぱな",
    "うみにこ",
  ],

  /* 凛 */
  [
    "りんほの",
    "りんえり",
    "りんこと",
    "りんうみ",
    null,
    "りんまき",
    "りんのぞ",
    "りんぱな",
    "りんにこ",
  ],

  /* 真姫 */
  [
    "まきほの",
    "まきえり",
    "まきこと",
    "まきうみ",
    "まきりん",
    null,
    "まきのぞ",
    "まきぱな",
    "まきにこ",
  ],

  /* 希 */
  [
    "のぞほの",
    "のぞえり",
    "のぞこと",
    "のぞうみ",
    "のぞりん",
    "のぞまき",
    null,
    "のぞぱな",
    "のぞにこ",
  ],

  /* 花陽 */
  [
    "ぱなほの",
    "ぱなえり",
    "ぱなこと",
    "ぱなうみ",
    "ぱなりん",
    "ぱなまき",
    "ぱなのぞ",
    null,
    "ぱなにこ",
  ],

  /* にこ */
  [
    "にこほの",
    "にこえり",
    "にことり",
    "にこうみ",
    "にこりん",
    "にこまき",
    "にこのぞ",
    "にこぱな",
    null,
  ],
];
