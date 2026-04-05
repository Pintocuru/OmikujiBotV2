// src/types/OmikujiData/UiSettings/ToastWidgetsSchema.ts
import { z } from 'zod'

/**
 * トースト・サムネイル CommentBubble
 */
export const ToastWidgetsSchema = z.object({
  showToastsOnRight: z.boolean().default(false).catch(false), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type ToastWidgetsType = z.infer<typeof ToastWidgetsSchema>
