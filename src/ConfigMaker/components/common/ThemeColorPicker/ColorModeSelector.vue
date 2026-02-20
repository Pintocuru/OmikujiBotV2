<!-- src/ConfigMaker/components/common/ThemeColorPicker/ColorModeSelector.vue -->
<template>
  <!-- モード切り替えヘッダー -->
  <div class="flex justify-end items-center gap-2">
    <!-- 切り替えトグル -->
    <label class="label cursor-pointer gap-3">
      <span class="label-text">{{ colorValue.isTheme ? '旧カラー設定' : '新カラー設定' }}</span>
      <input type="checkbox" class="toggle toggle-primary" :checked="colorValue.isTheme" @change="toggleColorMode" />
    </label>
  </div>

  <!-- 旧カラー設定 -->
  <LegacyColorPicker
    v-if="!colorValue.isTheme"
    :model-value="colorValue"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <!-- 新カラー設定 -->
  <DaisyUiThemeEditor v-else :model-value="themeFields" @update:model-value="handleThemeUpdate" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/'
  import DaisyUiThemeEditor from './DaisyUiThemeEditor.vue'
  import LegacyColorPicker from './LegacyColorPicker.vue'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const colorValue = computed(() => props.modelValue)

  const themeFields = computed<DaisyUiThemeFieldsType>(() => ({
    daisyUiTheme: colorValue.value.daisyUiTheme,
    backFrom: colorValue.value.backFrom,
    backTo: colorValue.value.backTo,
  }))

  const updateColor = (updates: Partial<CharacterColorType>) => {
    emit('update:modelValue', {
      ...colorValue.value,
      ...updates,
    })
  }

  const handleThemeUpdate = (newValue: DaisyUiThemeFieldsType) => {
    updateColor(newValue)
  }

  const toggleColorMode = () => {
    updateColor({ isTheme: !colorValue.value.isTheme })
  }
</script>
