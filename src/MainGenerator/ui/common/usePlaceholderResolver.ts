// src/MainGenerator/ui/common/usePlaceholderResolver.ts
import { DefaultPlaceholdersMetaSchema } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'

/**
 * プレースホルダー変換
 */
export function usePlaceholderResolver() {
  const appStore = useAppStore()

  const resolveComment = (raw: string): string => {
    const meta = appStore.serviceMetaStore.getCurrent()
    const uniqueCount = appStore.userSession.stats.getUniqueCount()
    const { liveComments, syoken } = appStore.streamStats.getStats()
    const draw = appStore.userSession.stats.drawWinners()

    const base = DefaultPlaceholdersMetaSchema.parse({
      viewer: meta?.viewer ?? 0,
      upVote: meta?.upVote ?? 0,
      follower: meta?.follower ?? 0,
      lc: liveComments,
      commenter: uniqueCount,
      syoken: syoken,
      winner: draw.winners[0]?.userName ?? '名無し',
    })

    const cp = new ContentPlaceholder(appStore.data.placeholders)
    cp.updateResolvedValues(base)

    return cp.processText(raw)
  }

  return { resolveComment }
}
