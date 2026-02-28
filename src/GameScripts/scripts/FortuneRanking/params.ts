// src/GameScripts/scripts/FortuneRanking/params.ts
import { z } from 'zod'

/**
 * params
 */
export const DEFAULT_FRUITS = [
  'いちご',
  'ぶどう',
  'デコポン',
  'かき',
  'りんご',
  'なし',
  'パイナップル',
  'もも',
  'メロン',
  'スイカ',
] as const

export const DEFAULT_KEY_MAP: Record<string, string> = {
  いちご: 'strawberry',
  ぶどう: 'grape',
  デコポン: 'shiranui',
  かき: 'persimmon',
  りんご: 'apple',
  なし: 'pear',
  パイナップル: 'pineapple',
  もも: 'peach',
  メロン: 'melon',
  スイカ: 'watermelon',
}
export const GameParamsSchema = z.object({
  projectName: z.string().default('fortune'),
  fruits: z.string().min(1),
})
export type GameParams = z.infer<typeof GameParamsSchema>
