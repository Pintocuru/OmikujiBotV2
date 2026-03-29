// src/common/MockUser/MockUserJaMaps.ts

/**
 * ランダムな名前
 */
export const MOCK_USER_GIVEN_JA_MAP: Record<string, { label: string; avatarStyle: string }> = {
  daisuika: {
    label: 'てい',
    avatarStyle: 'pixel-art',
  },
  poppii: {
    label: 'ポッピィー',
    avatarStyle: 'adventurer',
  },
  hutonchan: {
    label: 'おふとん',
    avatarStyle: 'soft',
  },
  mokou: {
    label: 'もこもこ',
    avatarStyle: 'big-ears',
  },
  jun: {
    label: 'じゅん',
    avatarStyle: 'fun-emoji',
  },
  takayuki: {
    label: 'たかゆき',
    avatarStyle: 'adventurer',
  },
  suisei: {
    label: 'すいすい',
    avatarStyle: 'pixel-art',
  },
  amemiya: {
    label: 'たいよう',
    avatarStyle: 'sunset',
  },
  fuwami: {
    label: 'ふわみ',
    avatarStyle: 'soft',
  },
  iroha: {
    label: 'いろは',
    avatarStyle: 'lorelei',
  },
  nana: {
    label: 'なな',
    avatarStyle: 'adventurer',
  },
  kiyoshi: {
    label: 'きよし',
    avatarStyle: 'pixel-art',
  },
  otoha: {
    label: 'おとは',
    avatarStyle: 'lorelei',
  },
  kohaku: {
    label: 'こはく',
    avatarStyle: 'big-ears',
  },
  sakura: {
    label: 'さくら',
    avatarStyle: 'adventurer',
  },
  pokora: {
    label: 'ぽこら',
    avatarStyle: 'soft',
  },
  minato: {
    label: 'あくま',
    avatarStyle: 'evil',
  },
  joker: {
    label: 'りきいち',
    avatarStyle: 'pixel-art',
  },
  seikin: {
    label: 'せいじん',
    avatarStyle: 'adventurer',
  },
  president: {
    label: 'はじめ',
    avatarStyle: 'fun-emoji',
  },
  akami: {
    label: 'かるび',
    avatarStyle: 'pixel-art',
  },
  miku: {
    label: 'みく',
    avatarStyle: 'lorelei',
  },
  hikawa: {
    label: 'あおい',
    avatarStyle: 'soft',
  },
  bayashi: {
    label: 'こばや',
    avatarStyle: 'big-ears',
  },
  quiz: {
    label: 'くいず',
    avatarStyle: 'adventurer',
  },
  darkrai: {
    label: 'さーくら',
    avatarStyle: 'pixel-art',
  },
  shachi: {
    label: 'しゃち',
    avatarStyle: 'adventurer',
  },
  zunko: {
    label: 'とうほく',
    avatarStyle: 'fun-emoji',
  },
  neko: {
    label: 'ねこ',
    avatarStyle: 'big-ears',
  },
  plus: {
    label: 'ぷらす',
    avatarStyle: 'pixel-art',
  },
  onair: {
    label: 'うかい',
    avatarStyle: 'adventurer',
  },
  sushi: {
    label: 'りく',
    avatarStyle: 'sunset',
  },
  cook: {
    label: 'まぐれ',
    avatarStyle: 'fun-emoji',
  },
  takana: {
    label: 'たかな',
    avatarStyle: 'pixel-art',
  },
  miko: {
    label: 'みこ',
    avatarStyle: 'lorelei',
  },
  takatora: {
    label: 'たかとら',
    avatarStyle: 'adventurer',
  },
  dosukebe: {
    label: 'どすけべ',
    avatarStyle: 'evil',
  },
  sesupin: {
    label: 'せすぴん',
    avatarStyle: 'soft',
  },
  boobobo: {
    label: '渋谷区大型デパートヨコセヨ',
    avatarStyle: 'pixel-art',
  },
}

// ランダム選択用の配列（必要に応じて）
export const MOCK_USER_GIVEN_JA_LIST = Object.values(MOCK_USER_GIVEN_JA_MAP)

/**
 * ランダムな姓名
 */
export const MOCK_FAMILY_NAME_JA_MAP: Record<string, string> = {
  koe: '越愛',
  amagase: '天ヶ瀬',
  hoshizaki: '星ヶ崎',
  tsukizaki: '月ヶ崎',
  tsukuyomi: '月詠',
  amano: '天之',
  hinata: '日向',
  kamishiro: '神代',
  yozora: '夜空',
  kitsunezuka: '狐塚',
  shirayuki: '白雪',
  shiranui: '不知火',
  kisaragi: '如月',
  yumesaki: '夢咲',
  sakuraka: '桜華',
  sorami: '空見',
  yumemi: '夢見',
  hoshizume: '星詠',
  iroha: '彩羽',
  nagisa: '凪沙',
  hokuyo: '焔夜',
  saotome: '早乙女',
  shinkoiwa: '新小岩',
  kudakura: '久多良木',
  pokekatsu: 'ポイ活',
  zekkyo: '絶叫',
  nemibuzoku: '寝不足',
  kamihiki: '神引き',
  numaochi: '沼落ち',
  gachanuma: 'ガチャ沼',
  wabishi: '詫び石',
  teichien: '低遅延',
  nagesen: '投げ銭',
  babiniku: 'バ美肉',
  uraaka: '裏垢',
  kinkyuseihoso: '緊急生放送',
  kakingyou: '課金厨',
  teifujo: '低浮上',
  shimekirimajika: '〆切間近',
  jitakukeibii: '自宅警備員',
  rogubo: 'ログボ・',
  migiushironaname: '右斜め後ろ',
  kabushikigaisha: '（株）全日本',
  higeki: '【悲報】',
  oouso: '大嘘',
  kenjo: '嫌儲',
  yaju: '野獣',
  hatsuhaisin: '初配信',
  yamada: '山田（仮）',
  dennou: '電脳',
}

// ランダム選択用
export const MOCK_FAMILY_NAME_JA_LIST = Object.values(MOCK_FAMILY_NAME_JA_MAP)
