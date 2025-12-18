<!-- src\MainGenerator\components\CounterPreview\CounterPreviewCard.vue-->
<template>
  <div
    class="mx-auto w-fit min-w-3xs p-4 rounded-2xl shadow-xl text-center bg-gradient-to-br from-primary to-secondary text-primary-content transition-transform duration-200"
    :class="isBouncing && 'scale-110'"
    :data-theme="counterSetting.color"
  >
    <div v-if="counterSetting.label !== ''" class="text-xl font-semibold opacity-80">
      {{ counterSetting.label }}
    </div>

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
</script>
