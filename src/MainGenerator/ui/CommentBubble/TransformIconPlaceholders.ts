// src\MainGenerator\ui\CommentBubble\TransformIconPlaceholders.ts
import { useAppStore } from '@main/stores/useAppStore'

export function transformIconPlaceholders(raw: string): string {
  const store = useAppStore()
  if (!store) return ''

  return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
    const user = store.userSession.stats.get(userId)
    const url = user?.profileImage
    if (!url) return ''
    return `<img class="inline-block w-6 h-6 rounded-full" src="${url}" />`
  })
}
