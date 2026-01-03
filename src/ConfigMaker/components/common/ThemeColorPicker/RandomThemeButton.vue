<!-- src/ConfigMaker/components/common/ThemeColorPicker/RandomThemeButton.vue -->
<template>
  <div class="flex gap-2">
    <!-- テーマランダム -->
    <button class="btn btn-sm btn-accent gap-2" @click="emitBasicTheme" title="テーマのみのランダム">
      <Palette :size="16" />
      テーマ
    </button>

    <template v-if="isAdv">
      <!-- 単色 -->
      <button class="btn btn-sm btn-accent gap-2" @click="emitMonoTheme" title="単色ランダム">
        <Droplet :size="16" />
        単色
      </button>

      <!-- 全ランダム -->
      <button class="btn btn-sm btn-accent gap-2" @click="emitRandomTheme" title="テーマとカラーをランダムに選択">
        <Dices :size="16" />
        超ランダム
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { Palette, Droplet, Dices } from 'lucide-vue-next'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { themes, daisyUIColor, type DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const emit = defineEmits<{
    randomize: [value: DaisyUiThemeFieldsType]
  }>()

  const { isAdv } = useSettingMode()

  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]

  const emitBasicTheme = () => {
    emit('randomize', {
      daisyUiTheme: pick(themes),
      backFrom: 'primary',
      backTo: 'secondary',
    })
  }

  const emitRandomTheme = () => {
    emit('randomize', {
      daisyUiTheme: pick(themes),
      backFrom: pick(daisyUIColor),
      backTo: pick(daisyUIColor),
    })
  }

  const emitMonoTheme = () => {
    const color = pick(daisyUIColor)
    emit('randomize', {
      daisyUiTheme: pick(themes),
      backFrom: color,
      backTo: color,
    })
  }
</script>
