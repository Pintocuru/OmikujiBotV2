// src/MainGenerator/scripts/CharacterManager/CharacterManagerHelper.ts
import { CharacterType, ShowCharactersSchema } from '@/types'

export const buildDefaultShowCharacters = (characters: Record<string, CharacterType>) => {
  const keys = Object.values(characters).map((c) => c.key)
  return ShowCharactersSchema.parse({ center: keys })
}
