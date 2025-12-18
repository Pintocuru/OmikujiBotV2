<!-- src\MainGenerator\components\CounterPreview\UserListDisplay.vue-->
<template>
  <div
    class="mx-auto w-fit min-w-3xs p-4 rounded-2xl shadow-xl text-center bg-gradient-to-br from-primary to-secondary text-primary-content transition-transform duration-200"
    :data-theme="counterSetting.color"
  >
    <div class="text-xl font-semibold opacity-80 pb-4">
      {{ counterSetting.label }}
    </div>

    <ul class="flex flex-wrap gap-2 justify-center">
      <li v-for="name in users" :key="name" class="badge badge-warning px-3 py-2 text-sm font-semibold">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { SettingsCounterType } from '@/types'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    users: string[]
  }>()
</script>
