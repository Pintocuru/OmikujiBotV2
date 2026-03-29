// src/common/MockUser/MockUserThMaps.ts

/**
 * タイ語配信者っぽい名前（名）
 * 親しみやすく、覚えやすいニックネーム
 */
export const MOCK_GIVEN_NAME_TH_MAP: Record<string, { label: string; avatarStyle: string }> = {
  may: { label: 'เมย์', avatarStyle: 'lorelei' }, // May（5月生まれに多い）
  ploy: { label: 'พลอย', avatarStyle: 'soft' }, // Ploy（宝石）
  ice: { label: 'ไอซ์', avatarStyle: 'pixel-art' }, // Ice（英語由来）
  bank: { label: 'แบงค์', avatarStyle: 'adventurer' }, // Bank（銀行/紙幣）
  beer: { label: 'เบียร์', avatarStyle: 'fun-emoji' }, // Beer（ビール）
  nam: { label: 'น้ำ', avatarStyle: 'big-ears' }, // Nam（水）
  fa: { label: 'ฟ้า', avatarStyle: 'sunset' }, // Fa（空）
  new: { label: 'นิว', avatarStyle: 'adventurer' }, // New（新しい）
  ball: { label: 'บอล', avatarStyle: 'pixel-art' }, // Ball（ボール）
  golf: { label: 'กอล์ฟ', avatarStyle: 'big-ears' }, // Golf（ゴルフ）
  film: { label: 'ฟิล์ม', avatarStyle: 'lorelei' }, // Film（フィルム）
  book: { label: 'บุ๊ค', avatarStyle: 'soft' }, // Book（本）
  mind: { label: 'มายด์', avatarStyle: 'fun-emoji' }, // Mind（心）
  fame: { label: 'เฟม', avatarStyle: 'adventurer' }, // Fame（名声）
  mook: { label: 'มุก', avatarStyle: 'lorelei' }, // Mook（真珠）
  look: { label: 'ลูก', avatarStyle: 'pixel-art' }, // Look（子供/果実）
  arm: { label: 'อาร์ม', avatarStyle: 'adventurer' }, // Arm（腕）
  ken: { label: 'เคน', avatarStyle: 'big-ears' }, // Ken（ケン）
  james: { label: 'เจมส์', avatarStyle: 'soft' }, // James（ジェームズ）
  belle: { label: 'เบลล์', avatarStyle: 'lorelei' }, // Belle（ベル）
}

export const MOCK_GIVEN_NAME_TH_LIST = Object.values(MOCK_GIVEN_NAME_TH_MAP)

/**
 * タイ語配信者っぽい苗字（姓）
 * 一般的で親しみやすい苗字
 */
export const MOCK_FAMILY_NAME_TH_MAP: Record<string, string> = {
  saetang: 'แสงตัง', // Saetang（最も多い苗字）
  sukkasem: 'สุขเกษม', // Sukkasem（幸福）
  sangthong: 'สังข์ทอง', // Sangthong（金の貝）
  thongkham: 'ทองคำ', // Thongkham（黄金）
  chanthara: 'จันทรา', // Chanthara（月）
  bunmi: 'บุญมี', // Bunmi（徳がある）
  suwan: 'สุวรรณ', // Suwan（金）
  rungrueang: 'รุ่งเรือง', // Rungrueang（繁栄）
  chaichana: 'ชัยชนะ', // Chaichana（勝利）
  thongsuk: 'ทองสุข', // Thongsuk（金の幸福）
  wongsa: 'วงศา', // Wongsa（家系）
  panya: 'ปัญญา', // Panya（知恵）
  sri: 'ศรี', // Sri（栄光）
  boon: 'บุญ', // Boon（功徳）
  chai: 'ชัย', // Chai（勝利）
  decha: 'เดชา', // Decha（力）
  prasert: 'ประเสริฐ', // Prasert（優れた）
  somchai: 'สมชาย', // Somchai（男らしい）
  sompong: 'สมพงษ์', // Sompong（一族）
  somsak: 'สมศักดิ์', // Somsak（名誉）
}

export const MOCK_FAMILY_NAME_TH_LIST = Object.values(MOCK_FAMILY_NAME_TH_MAP)
