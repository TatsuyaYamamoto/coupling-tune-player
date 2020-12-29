/**
 * @fileOverview muse.
 */
import SchoolIdol from "./model/SchoolIdol";
import Name from "./model/Name";

export const Chika = new SchoolIdol({
  name: new Name("高海", "千歌"),
  kanaName: new Name("たかみ", "ちか"),
  alphabetName: new Name("takami", "chika"),
  voiceActorName: "伊波杏樹",
  groupName: "aqours",
});

export const Riko = new SchoolIdol({
  name: new Name("桜内", "梨子"),
  kanaName: new Name("さくらうち", "りこ"),
  alphabetName: new Name("sakurauchi", "riko"),
  voiceActorName: "逢田梨香子",
  groupName: "aqours",
});

export const Kanan = new SchoolIdol({
  name: new Name("松浦", "果南"),
  kanaName: new Name("まつうら", "かなん"),
  alphabetName: new Name("matsuura", "kanan"),
  voiceActorName: "諏訪ななか",
  groupName: "aqours",
});

export const Dia = new SchoolIdol({
  name: new Name("黒澤", "ダイヤ"),
  kanaName: new Name("くろさわ", "だいや"),
  alphabetName: new Name("kurosawa", "dia"),
  voiceActorName: "小宮有紗",
  groupName: "aqours",
});

export const You = new SchoolIdol({
  name: new Name("渡辺", "曜"),
  kanaName: new Name("わたなべ", "よう"),
  alphabetName: new Name("watanabe", "you"),
  voiceActorName: "斉藤朱夏",
  groupName: "aqours",
});

export const Yoshiko = new SchoolIdol({
  name: new Name("津島", "善子"),
  kanaName: new Name("つしま", "よしこ"),
  alphabetName: new Name("tsushima", "yoshiko"),
  voiceActorName: "小林愛香",
  groupName: "aqours",
});

export const Hanamaru = new SchoolIdol({
  name: new Name("国木田", "花丸"),
  kanaName: new Name("くにきだ", "はなまる"),
  alphabetName: new Name("kunikida", "hanamaru"),
  voiceActorName: "高槻かなこ",
  groupName: "aqours",
});

export const Mari = new SchoolIdol({
  name: new Name("小原", "鞠莉"),
  kanaName: new Name("おはら", "まり"),
  alphabetName: new Name("ohara", "mari"),
  voiceActorName: "鈴木愛奈",
  groupName: "aqours",
});

export const Ruby = new SchoolIdol({
  name: new Name("黒澤", "ルビィ"),
  kanaName: new Name("くろさわ", "るびぃ"),
  alphabetName: new Name("kurosawa", "ruby"),
  voiceActorName: "降幡愛",
  groupName: "aqours",
});

export function getIndex(member: SchoolIdol): number | null {
  if (member === Chika) {
    return 0;
  }

  if (member === Riko) {
    return 1;
  }

  if (member === Kanan) {
    return 2;
  }

  if (member === Dia) {
    return 3;
  }

  if (member === You) {
    return 4;
  }

  if (member === Yoshiko) {
    return 5;
  }

  if (member === Hanamaru) {
    return 6;
  }

  if (member === Mari) {
    return 7;
  }

  if (member === Ruby) {
    return 8;
  }

  throw new Error("Unexpected error. Could not find any member.");
}

/**
 * @link https://dic.pixiv.net/a/%E3%83%A9%E3%83%96%E3%83%A9%E3%82%A4%E3%83%96%21%E3%82%B5%E3%83%B3%E3%82%B7%E3%83%A3%E3%82%A4%E3%83%B3%21%21%E3%81%AE%E3%82%AB%E3%83%83%E3%83%97%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%BF%E3%82%B0%E4%B8%80%E8%A6%A7
 */
export const aqoursCouplingNameMap = [
  /* "千歌" */
  [
    null,
    "ちかりこ",
    "ちかなん",
    "ちかダイ",
    "ようちか",
    "ちかよし",
    "ちかまる",
    "ちかまり",
    "ちかるび",
  ],

  /* 梨子 */
  [
    "ちかりこ",
    null,
    "かなりこ",
    "だいりこ",
    "ようりこ",
    "よしりこ",
    "りこまる",
    "まりりこ",
    "りこるび",
  ],

  /* 果南 */
  [
    "ちかなん",
    "かなりこ",
    null,
    "かなダイ",
    "ようかな",
    "かなよし",
    "かなまる",
    "かなまり",
    "かなルビ",
  ],

  /* ダイヤ */
  [
    "ちかダイ",
    "だいりこ",
    "かなダイ",
    null,
    "ダイよう",
    "だいよし",
    "ダイまる",
    "だいまり",
    "ダイルビ",
  ],

  /* 曜 */
  [
    "ようちか",
    "ようりこ",
    "ようかな",
    "ダイよう",
    null,
    "ようよし",
    "ようまる",
    "ようまり",
    "ようルビ",
  ],

  /* 善子 */
  [
    "ちかよし",
    "よしりこ",
    "かなよし",
    "だいよし",
    "ようよし",
    null,
    "よしまる",
    "よしまり",
    "よしルビ",
  ],

  /* 花丸 */
  [
    "ちかまる",
    "りこまる",
    "かなまる",
    "ダイまる",
    "ようまる",
    "よしまる",
    null,
    "まりまる",
    "ルビまる",
  ],

  /* 鞠莉 */
  [
    "ちかまり",
    "まりりこ",
    "かなまり",
    "だいまり",
    "ようまり",
    "よしまり",
    "まりまる",
    null,
    "ルビまり",
  ],

  /* ルビィ */
  [
    "ちかるび",
    "りこるび",
    "かなルビ",
    "ダイルビ",
    "ようルビ",
    "よしルビ",
    "ルビまる",
    "ルビまり",
    null,
  ],
];
