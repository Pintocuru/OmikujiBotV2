// src/common/DiceBear/getAvatarUrl.ts
import { nanoid } from 'nanoid'

export const getAvatarUrl = (name?: string) => {
  const rawSeed = name?.trim() || nanoid()
  const seed = encodeURIComponent(rawSeed)

  const style = AVATAR_STYLES[hash(seed) % AVATAR_STYLES.length]
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=32`
}

const AVATAR_STYLES = ['bottts', 'lorelei', 'notionists', 'open-peeps', 'pixel-art']

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}
