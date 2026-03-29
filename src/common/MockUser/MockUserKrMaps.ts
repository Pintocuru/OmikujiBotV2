// src/common/MockUser/MockUserKrMaps.ts

/**
 * 韓国語配信者っぽい名前（名）
 * 親しみやすく、覚えやすい名前
 */
export const MOCK_GIVEN_NAME_KO_MAP: Record<string, { label: string; avatarStyle: string }> = {
  jiWoo: { label: '지우', avatarStyle: 'adventurer' },
  minJun: { label: '민준', avatarStyle: 'pixel-art' },
  seoYeon: { label: '서연', avatarStyle: 'lorelei' },
  haJun: { label: '하준', avatarStyle: 'soft' },
  jiAn: { label: '지안', avatarStyle: 'big-ears' },
  suJi: { label: '수지', avatarStyle: 'fun-emoji' },
  iSu: { label: '이수', avatarStyle: 'adventurer' },
  naEun: { label: '나은', avatarStyle: 'lorelei' },
  doYun: { label: '도윤', avatarStyle: 'sunset' },
  yeJin: { label: '예진', avatarStyle: 'soft' },
}

export const MOCK_GIVEN_NAME_KO_LIST = Object.values(MOCK_GIVEN_NAME_KO_MAP)

/**
 * 韓国語配信者っぽい苗字（姓）
 * 一般的で親しみやすい苗字
 */
export const MOCK_FAMILY_NAME_KO_MAP: Record<string, string> = {
  kim: '김',
  lee: '이',
  park: '박',
  choi: '최',
  jung: '정',
  kang: '강',
  jo: '조',
  yoon: '윤',
  jang: '장',
  lim: '임',
}

export const MOCK_FAMILY_NAME_KO_LIST = Object.values(MOCK_FAMILY_NAME_KO_MAP)
