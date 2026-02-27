// src/MainGenerator/ui/common/usePlaceholderResolver.ts
import { useAppStore } from '@main/stores/useAppStore'
import { storeToRefs } from 'pinia'
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'

/**
 * プレースホルダー変換
 */
export function usePlaceholderResolver() {
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const resolveComment = (raw: string): string => {
    const meta = appStore.metaState.getCurrent()
    const draw = appStore.userSession.stats.drawWinners()

    const placeholderValues: Record<string, string | number> = {
      upVote: meta?.upVote ?? 0,
      viewer: meta?.viewer ?? 0,
      commenter: draw.commenter ?? 0,
      winner: draw.winners[0]?.userName ?? '名無し',
    }

    const cp = new ContentPlaceholder(data.value.placeholders)
    cp.updateResolvedValues(placeholderValues)

    return cp.processText(raw)
  }

  return {
    resolveComment,
  }
}
