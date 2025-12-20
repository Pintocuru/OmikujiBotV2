<!-- src/configMaker/components/characters/RandomThemeButton.vue -->
<template>
  <button class="btn btn-sm btn-accent gap-2" @click="emitRandomTheme()" title="テーマとカラーをランダムに選択">
    <Dices :size="16" />
    ランダム
  </button>
</template>

<script setup lang="ts">
  import { Dices } from 'lucide-vue-next'
  import { themes, daisyUIColor, DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const emit = defineEmits<{
    randomize: [value: DaisyUiThemeFieldsType]
  }>()

  const emitRandomTheme = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const randomBackFrom = daisyUIColor[Math.floor(Math.random() * daisyUIColor.length)]
    const randomBackTo = daisyUIColor[Math.floor(Math.random() * daisyUIColor.length)]

    emit('randomize', {
      daisyUiTheme: randomTheme,
      backFrom: randomBackFrom,
      backTo: randomBackTo,
    })
  }
</script>
