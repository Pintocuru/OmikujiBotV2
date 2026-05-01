// src/MainGenerator/ui/CounterPreview/layouts/base/useCounterDisplay.ts
import { ref, watch, computed } from 'vue'
import { CounterPreviewType } from '@/types'
import { UserNameType } from '@shared/types'

export function useCounterDisplay(
  props: {
    counterSetting: CounterPreviewType
    count: number | null
    users: UserNameType[]
  },
  config: {
    showCounter: boolean
    limitUserCount: number | null
  }
) {
  const isBouncing = ref(false)

  const displayCount = computed(() => {
    const c = props.count
    return c !== null ? c : '---'
  })

  const displayedUsers = computed(() => {
    const { target } = props.counterSetting
    const { limitUserCount } = config

    if (limitUserCount !== null && limitUserCount <= 0) {
      return []
    }

    const reversed = props.users.slice().reverse()

    if (target === 'user') {
      const seen = new Set<string>()
      const unique: UserNameType[] = []

      for (const user of reversed) {
        if (seen.has(user.userId)) continue
        seen.add(user.userId)
        unique.push(user)

        if (limitUserCount !== null && unique.length >= limitUserCount) {
          break
        }
      }

      return unique
    }

    return limitUserCount === null ? reversed : reversed.slice(0, limitUserCount)
  })

  watch(
    () => props.count,
    () => {
      isBouncing.value = true
      setTimeout(() => (isBouncing.value = false), 180)
    }
  )

  return {
    isBouncing,
    displayCount,
    displayedUsers,
    showCounter: config.showCounter,
  }
}
