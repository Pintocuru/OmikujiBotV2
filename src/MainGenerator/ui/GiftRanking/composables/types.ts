// src/MainGenerator/ui/GiftRanking/composables/types.ts
import { GiftDisplayOption } from '@/types'
import { OmikenCommentType } from '@shared/types'

export interface GiftLayoutProps {
  messages: OmikenCommentType[]
  displayOptions: GiftDisplayOption[]
  iconSize: number
}
