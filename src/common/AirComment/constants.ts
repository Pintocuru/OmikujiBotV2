export const COMMENTS = ['こんにちはー！', 'お疲れさまです！', 'わかる〜', 'そうなんですね', '草', 'それな']

const NAME_PARTS = {
  animal: ['ねこ', 'いぬ', 'うさぎ', 'きつね', 'たぬき'],
  nature: ['そら', 'うみ', 'かぜ', 'ほし', 'つき'],
  suffix: ['', '', 'ちゃん', 'くん', 'P', '推し'],
}

export function generateUsername(): string {
  const categories = ['animal', 'nature'] as const
  const cat = categories[Math.floor(Math.random() * categories.length)]
  const name = NAME_PARTS[cat][Math.floor(Math.random() * NAME_PARTS[cat].length)]
  const suffix = NAME_PARTS.suffix[Math.floor(Math.random() * NAME_PARTS.suffix.length)]
  return name + suffix
}

// DiceBear
const AVATAR_STYLES = ['pixel-art', 'bottts', 'adventurer', 'thumbs', 'lorelei']

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function getAvatarUrl(seed: string): string {
  const style = AVATAR_STYLES[hash(seed) % AVATAR_STYLES.length]
  return `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&size=32`
}
