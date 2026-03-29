// src/common/MockUser/MockUserChMaps.ts

/**
 * 中文配信者っぽい名前（名）
 * 親しみやすく、覚えやすい名前
 */
export const MOCK_GIVEN_NAME_ZH_MAP: Record<string, { label: string; avatarStyle: string }> = {
  xiaoYu: { label: '小宇', avatarStyle: 'adventurer' },
  aJie: { label: '阿杰', avatarStyle: 'pixel-art' },
  xiaoMing: { label: '小明', avatarStyle: 'fun-emoji' },
  xiaoMei: { label: '小美', avatarStyle: 'lorelei' },
  xiaoAi: { label: '小愛', avatarStyle: 'soft' },
  leLe: { label: '樂樂', avatarStyle: 'big-ears' },
  keKe: { label: '可可', avatarStyle: 'adventurer' },
  tangTang: { label: '糖糖', avatarStyle: 'soft' },
  yuanQi: { label: '元氣', avatarStyle: 'sunset' },
  douDou: { label: '豆豆', avatarStyle: 'pixel-art' },
}

export const MOCK_GIVEN_NAME_ZH_LIST = Object.values(MOCK_GIVEN_NAME_ZH_MAP)

/**
 * 中文配信者っぽい苗字（姓）
 * 一般的で親しみやすい苗字
 */
export const MOCK_FAMILY_NAME_ZH_MAP: Record<string, string> = {
  wang: '王',
  li: '李',
  zhang: '張',
  liu: '劉',
  chen: '陳',
  yang: '楊',
  huang: '黃',
  zhao: '趙',
  wu: '吳',
  zhou: '周',
}

export const MOCK_FAMILY_NAME_ZH_LIST = Object.values(MOCK_FAMILY_NAME_ZH_MAP)
