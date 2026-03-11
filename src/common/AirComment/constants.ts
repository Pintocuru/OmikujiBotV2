//

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
