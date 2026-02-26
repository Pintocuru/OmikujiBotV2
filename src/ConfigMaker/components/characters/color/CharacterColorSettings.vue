<!-- src/ConfigMaker/components/characters/color/CharacterColorSettings.vue -->
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

  <!-- フキダシカラー設定 -->
  <SubSectionHeader icon="Palette" title="カラー設定" description="フキダシの配色やテーマカラーを設定します" />
  <ColorModeSelector :model-value="currentColor" @update:model-value="handleColorUpdate" />

  <!-- カスタムクラス設定 -->
  <CustomClassSelector
    v-model="currentColor.customClasses"
    @update:modelValue="(value) => updateColorField('customClasses', value)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/'
  import CustomClassSelector from '../CustomClass/CustomClassSelector.vue'
  import CommentBubblePreview from '@config/components/componentEditor/CommentBubble/CommentBubblePreview.vue'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { useNavigationStore } from '@config/stores/useNavigationStore'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // 色設定を更新する共通関数
  const updateColor = (updates: Partial<CharacterColorType>) => {
    if (!selectedItemKey.value) return

    updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      ...updates,
    })
  }

  // ColorModeSelectorからの更新を受け取る
  const handleColorUpdate = (newColor: CharacterColorType) => {
    if (!selectedItemKey.value) return

    updateRecordProperty('characters', selectedItemKey.value, 'color', newColor)
  }

  // 個別フィールド更新（カスタムクラス用）
  const updateColorField = (key: keyof CharacterColorType, value: string) => {
    updateColor({ [key]: value })
  }
</script>
