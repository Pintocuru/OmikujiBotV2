<!-- src/ConfigMaker/components/common/ThemeColorPicker/ColorModeSelector.vue -->
<template>
  <!-- モード切り替えヘッダー -->
  <div v-if="isAdv || !modelValue.isTheme" class="flex justify-end items-center gap-2">
    <!-- 切り替えトグル -->
    <label class="label cursor-pointer gap-3">
      <span class="label-text">{{ modelValue.isTheme ? '旧カラー設定' : '新カラー設定' }}</span>
      <input type="checkbox" class="toggle toggle-primary" :checked="modelValue.isTheme" @change="toggleColorMode" />
    </label>
  </div>

  <!-- 旧カラー設定 -->
  <LegacyColorPicker
    v-if="!modelValue.isTheme"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <!-- 新カラー設定 -->
  <DaisyUiThemeEditor v-else :model-value="modelValue" @update:model-value="updateColor" />
</template>

<script setup lang="ts">
  import { CharacterColorType } from '@/types/OmikujiData/'
  import DaisyUiThemeEditor from './DaisyUiThemeEditor.vue'
  import LegacyColorPicker from './LegacyColorPicker.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const { isAdv } = useSettingMode()

  const updateColor = (updates: Partial<CharacterColorType>) => {
    emit('update:modelValue', {
      ...props.modelValue,
      ...updates,
    })
  }

  const toggleColorMode = async () => {
    // isAdvでないなら、確認
    if (!isAdv.value) {
      const result = await swalModal.confirmDelete({
        title: `旧カラー設定には戻れません。変更してよろしいですか？`,
        confirmButtonText: '変更する',
      })
      if (!result.isConfirmed) return
    }
    updateColor({ isTheme: !props.modelValue.isTheme })
  }
</script>
