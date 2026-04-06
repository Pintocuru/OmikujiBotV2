import { BotMessageBaseType, EventCategoryType } from '@/types'

/**
 * BotMessage[] に共通の source.category を付与する
 */
export function addSourceCategory<T extends BotMessageBaseType>(messages: T[], category: EventCategoryType): T[] {
  return messages.map((m) => ({
    ...m,
    source: {
      ...m.source,
      category,
    },
  }))
}
