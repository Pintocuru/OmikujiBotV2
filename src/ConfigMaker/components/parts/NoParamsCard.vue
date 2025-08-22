<!-- src\ConfigMaker\components\parts\NoParamsCard.vue -->
<template>
  <div class="card bg-base-200 p-4 flex flex-col items-center justify-center space-y-2">
    <component :is="icon" class="w-8 h-8 text-base-content/60" />
    <div class="text-base text-base-content/70 text-center">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as LucideIcons from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      message: string
      iconName?: keyof typeof LucideIcons
    }>(),
    {
      iconName: 'LucideAlertCircle',
    }
  )

  // props.iconName に対応する Lucide アイコンコンポーネントを取得
  const icon: any = LucideIcons[props.iconName]!
</script>
