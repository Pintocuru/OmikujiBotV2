<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview
      :botName="botName"
      :color="currentColor"
      :custom-classes="currentColor.customClasses"
      bubbleMotionEnter="none"
    />
  </div>

  <!-- カラー設定 -->
  <ColorModeSelector :model-value="currentColor" @update:model-value="handleColorUpdate" />

  <!-- カスタムクラス設定 -->
  <CustomClassSelector
    v-model="currentColor.customClasses"
    @update:modelValue="(value) => updateColorField('customClasses', value)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import CustomClassSelector from '../CustomClass/CustomClassSelector.vue'
  import CommentBubblePreview from '@/ConfigMaker/components/displaySettings/bubble/CommentBubblePreview.vue'
  import ColorModeSelector from './ColorModeSelector.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { selectedItemKey } = storeToRefs(omikujiStore)

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // 色設定を更新する共通関数
  const updateColor = (updates: Partial<CharacterColorType>) => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      ...updates,
    })
  }

  // ColorModeSelectorからの更新を受け取る
  const handleColorUpdate = (newColor: CharacterColorType) => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', newColor)
  }

  // 個別フィールド更新（カスタムクラス用）
  const updateColorField = (key: keyof CharacterColorType, value: string) => {
    updateColor({ [key]: value })
  }
</script>
