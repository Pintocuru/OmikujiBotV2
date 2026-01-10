<!-- src/MainGenerator/components/CounterPreview/CounterPreviewCard.vue -->
<template>
  <div
    class="w-full p-4 rounded-2xl text-center transition-transform duration-200"
    :class="[
      isBouncing && 'scale-110',
      `text-${counterSetting.color.backFrom}-content`,
      // From と To が同じかどうかでクラスを切り替える
      counterSetting.color.backFrom === counterSetting.color.backTo
        ? `bg-${counterSetting.color.backFrom}`
        : ['bg-gradient-to-br', `from-${counterSetting.color.backFrom}`, `to-${counterSetting.color.backTo}`],
    ]"
    :data-theme="counterSetting.color.daisyUiTheme"
  >
    <!-- 何も入力していないときのいたずら文 -->
    <div
      v-if="counterSetting.label === '' && !counterSetting.showCounter && counterSetting.limitUserCount === 0"
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
    <ul
      v-if="counterSetting.limitUserCount === null || counterSetting.limitUserCount > 0"
      class="flex flex-wrap gap-2 justify-center mt-3"
    >
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
            {{ (value.userName || 'A').charAt(0) }}
          </div>
        </div>
        {{ value.userName }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { SettingsCounterType } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | null
    users: UserVisitRecord[]
  }>()

  const isBouncing = ref(false)

  const displayCount = computed(() => {
    const c = props.count
    return c !== null ? c : '---'
  })

  // 最新が後ろに貯まるので逆順にして、limitUserCountで制限
  const displayedUsers = computed(() => {
    const { limitUserCount, target } = props.counterSetting

    // 0 以下なら表示しない
    if (limitUserCount !== null && limitUserCount <= 0) {
      return []
    }

    const reversed = props.users.slice().reverse()

    // user の場合のみ userId で重複排除
    if (target === 'user') {
      const seen = new Set<string>()
      const unique: UserVisitRecord[] = []

      for (const user of reversed) {
        if (seen.has(user.userId)) continue
        seen.add(user.userId)
        unique.push(user)

        // limitUserCount が null なら制限なし
        if (limitUserCount !== null && unique.length >= limitUserCount) {
          break
        }
      }

      return unique
    }

    // draw の場合（重複排除なし）
    return limitUserCount === null ? reversed : reversed.slice(0, limitUserCount)
  })

  watch(
    () => props.count,
    () => {
      isBouncing.value = true
      setTimeout(() => (isBouncing.value = false), 180)
    }
  )
</script>
