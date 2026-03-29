// src/common/AirComment/constants.ts
import { generateDummyVisitRecords } from '@/common/MockUser/MockGenerators'

// 切替フラグ（ここを直接変更する）
export const USERNAME_MODE: 'simple' | 'mock' = 'mock'
// 'simple' → NAME_PARTS
// 'mock'   → generateDummyVisitRecords

export const COMMENTS = [
  'こんにちはー！',
  'お疲れさまです！',
  'わかる〜',
  'そうなんですね',
  'それな',
  'おはよー',
  'おはようございます',
  'ナイス！',
  'GG',
  '草',
  'ｗｗｗ',
  '大草原',
]

const NAME_PARTS = {
  animal: ['ねこ', 'いぬ', 'うさぎ', 'きつね', 'たぬき'],
  nature: ['そら', 'うみ', 'かぜ', 'ほし', 'つき'],
  suffix: ['', '', 'ちゃん', 'くん', 'P', '推し'],
}

function generateSimpleUsername(): string {
  const categories = ['animal', 'nature'] as const
  const cat = categories[Math.floor(Math.random() * categories.length)]
  const name = NAME_PARTS[cat][Math.floor(Math.random() * NAME_PARTS[cat].length)]
  const suffix = NAME_PARTS.suffix[Math.floor(Math.random() * NAME_PARTS.suffix.length)]
  return name + suffix
}

function generateMockUsername(): string {
  // 1件だけ生成して使う
  const record = generateDummyVisitRecords(1)[0]
  return record.userName
}

export function generateUsername(): string {
  if (USERNAME_MODE === 'mock') return generateMockUsername()
  return generateSimpleUsername()
}
