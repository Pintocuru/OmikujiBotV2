<!-- src/MainGenerator/components/CounterPreview/CounterPreviewCard.vue -->
<template>
  <div
    class="mx-auto w-fit min-w-3xs p-4 rounded-2xl shadow-xl text-center text-primary-content transition-transform duration-200"
    :class="[
      isBouncing && 'scale-110',
      [
        'bg-gradient-to-br',
        `from-${testBg.from}`,
        `to-${testBg.to}`,

        ['bg-gradient-to-br', `from-${counterSetting.color.backFrom}`, `to-${counterSetting.color.backTo}`],
      ],
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
      {{ count }}
    </div>

    <!-- ユーザーリスト -->
    <ul v-if="counterSetting.maxUsers > 0" class="flex flex-wrap gap-2 justify-center mt-3">
      <li
        v-for="(name, index) in displayedUsers"
        :key="name + '-' + index"
        class="badge badge-warning px-3 py-2 text-sm font-semibold"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import type { SettingsCounterType } from '@/types/OmikujiData/DisplaySettingsSchema'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | string
    users: string[]
  }>()

  const isBouncing = ref(false)

  watch(
    () => props.count,
    () => {
      isBouncing.value = true
      setTimeout(() => (isBouncing.value = false), 180)
    }
  )

  // 最新が後ろに貯まるので逆順にして、maxUsersで制限
  const displayedUsers = computed(() => {
    if (props.counterSetting.maxUsers <= 0) return []
    return props.users.slice().reverse().slice(0, props.counterSetting.maxUsers)
  })

  /**
   * ▼ テスト用の背景設定
   * Tailwind のクラスが正しく反映されるか確認するための変数
   */
  const testBg = ref({
    from: 'primary',
    to: 'secondary',
  })
</script>
