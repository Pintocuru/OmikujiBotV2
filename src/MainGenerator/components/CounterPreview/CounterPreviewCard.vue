<!-- src/MainGenerator/components/CounterPreview/CounterPreviewCard.vue -->
<template>
  <div
    class="mx-auto w-fit min-w-3xs p-4 rounded-2xl shadow-xl text-center text-primary-content transition-transform duration-200"
    :class="[
      isBouncing && 'scale-110',
      // From と To が同じかどうかでクラスを切り替える
      counterSetting.color.backFrom === counterSetting.color.backTo
        ? `bg-${counterSetting.color.backFrom}`
        : ['bg-gradient-to-br', `from-${counterSetting.color.backFrom}`, `to-${counterSetting.color.backTo}`],
    ]"
    :data-theme="counterSetting.color.daisyUiTheme"
  >
    <!-- 何も入力していないときのいたずら文 -->
    <div
      v-if="counterSetting.label === '' && !counterSetting.showCounter && counterSetting.maxUsers === 0"
      class="text-xl font-semibold opacity-80"
    >
      ハハハハハ！何を表示しようと言うのかね！？
    </div>

    <!-- ラベル -->
    <div v-if="counterSetting.label !== ''" class="text-xl font-semibold opacity-80">
      {{ counterSetting.label }}
    </div>

    <!-- カウンター -->
    <div v-if="counterSetting.showCounter" class="text-7xl font-black leading-none drop-shadow-md">
      {{ displayCount }}
    </div>

    <!-- ユーザーリスト -->
    <ul v-if="counterSetting.maxUsers > 0" class="flex flex-wrap gap-2 justify-center mt-3">
      <li
        v-for="(value, index) in displayedUsers"
        :key="value.userId + '-' + index"
        class="badge badge-warning px-2 py-2 text-sm font-semibold"
      >
        <!-- アイコン -->
        <div v-if="value.profileImage !== ''" class="avatar">
          <div class="w-5 rounded-full">
            <img :src="value.profileImage" alt="" />
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-5 rounded-full flex items-center justify-center">
            {{ (value.name || 'A').charAt(0) }}
          </div>
        </div>
        {{ value.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { SettingsCounterType } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | string
    users: UserVisitRecord[]
  }>()

  const isBouncing = ref(false)

  const displayCount = computed(() => {
    const c = props.count

    // string の場合はそのまま表示
    if (typeof c === 'string') return c

    // number の場合は 0 未満を防ぎつつ整数化
    return Math.max(0, Math.floor(c))
  })

  watch(
    () => props.count,
    () => {
      isBouncing.value = true
      setTimeout(() => (isBouncing.value = false), 180)
    }
  )

  // 最新が後ろに貯まるので逆順にして、maxUsersで制限
  const displayedUsers = computed(() => {
    const { maxUsers, target } = props.counterSetting
    if (maxUsers <= 0) return []

    const reversed = props.users.slice().reverse()

    // user の場合のみ userId で重複排除
    if (target === 'user') {
      const seen = new Set<string>()
      const unique: UserVisitRecord[] = []

      for (const user of reversed) {
        if (seen.has(user.userId)) continue
        seen.add(user.userId)
        unique.push(user)
        if (unique.length >= maxUsers) break
      }

      return unique
    }

    // draw の場合はそのまま
    return reversed.slice(0, maxUsers)
  })
</script>
