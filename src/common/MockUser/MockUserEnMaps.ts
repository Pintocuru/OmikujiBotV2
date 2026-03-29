// src/common/MockUser/MockUserEnMaps.ts

/**
 * 英語圏配信者っぽい名前（名）
 * 配信文化を反映した、親しみやすく覚えやすい名前
 */
export const MOCK_GIVEN_NAME_EN_MAP: Record<string, { label: string; avatarStyle: string }> = {
  alex: { label: 'Alex', avatarStyle: 'adventurer' },
  sam: { label: 'Sam', avatarStyle: 'pixel-art' },
  jordan: { label: 'Jordan', avatarStyle: 'fun-emoji' },
  casey: { label: 'Casey', avatarStyle: 'big-ears' },
  riley: { label: 'Riley', avatarStyle: 'lorelei' },
  avery: { label: 'Avery', avatarStyle: 'soft' },
  quinn: { label: 'Quinn', avatarStyle: 'adventurer' },
  morgan: { label: 'Morgan', avatarStyle: 'pixel-art' },
  taylor: { label: 'Taylor', avatarStyle: 'sunset' },
  jesse: { label: 'Jesse', avatarStyle: 'fun-emoji' },
  cody: { label: 'Cody', avatarStyle: 'big-ears' },
  jamie: { label: 'Jamie', avatarStyle: 'lorelei' },
  parker: { label: 'Parker', avatarStyle: 'soft' },
  sage: { label: 'Sage', avatarStyle: 'adventurer' },
  phoenix: { label: 'Phoenix', avatarStyle: 'evil' },
  echo: { label: 'Echo', avatarStyle: 'pixel-art' },
  nova: { label: 'Nova', avatarStyle: 'sunset' },
  zen: { label: 'Zen', avatarStyle: 'soft' },
  blaze: { label: 'Blaze', avatarStyle: 'evil' },
  rocket: { label: 'Rocket', avatarStyle: 'adventurer' },
  toast: { label: 'Toast', avatarStyle: 'pixel-art' },
  waffles: { label: 'Waffles', avatarStyle: 'soft' },
  noodle: { label: 'Noodle', avatarStyle: 'big-ears' },
  pickle: { label: 'Pickle', avatarStyle: 'fun-emoji' },
  biscuit: { label: 'Biscuit', avatarStyle: 'lorelei' },
  mochi: { label: 'Mochi', avatarStyle: 'soft' },
  tater: { label: 'Tater', avatarStyle: 'adventurer' },
  bean: { label: 'Bean', avatarStyle: 'pixel-art' },
  nugget: { label: 'Nugget', avatarStyle: 'big-ears' },
  sprinkles: { label: 'Sprinkles', avatarStyle: 'lorelei' },
}

// リスト（必要に応じて）
export const MOCK_GIVEN_NAME_EN_LIST = Object.values(MOCK_GIVEN_NAME_EN_MAP)

/**
 * 英語圏配信者っぽい苗字（姓）
 * 親しみやすく、覚えやすい苗字
 */
export const MOCK_FAMILY_NAME_EN_MAP: Record<string, string> = {
  smith: 'Smith',
  jones: 'Jones',
  williams: 'Williams',
  brown: 'Brown',
  taylor: 'Taylor',
  davies: 'Davies',
  wilson: 'Wilson',
  evans: 'Evans',
  thomas: 'Thomas',
  johnson: 'Johnson',
  roberts: 'Roberts',
  walker: 'Walker',
  wright: 'Wright',
  robinson: 'Robinson',
  thompson: 'Thompson',
  white: 'White',
  hughes: 'Hughes',
  edwards: 'Edwards',
  green: 'Green',
  hall: 'Hall',
}

// リスト
export const MOCK_FAMILY_NAME_EN_LIST = Object.values(MOCK_FAMILY_NAME_EN_MAP)
