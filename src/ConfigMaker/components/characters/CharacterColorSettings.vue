<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <div class="flex justify-end gap-2">
    <!-- ランダムボタン -->
    <div class="tooltip tooltip-bottom" data-tip="ランダムな色テーマに変更">
      <button @click="handleRandomColor" class="btn btn-primary">
        <Dices class="w-4 h-4" />
        カラーシャッフル
      </button>
    </div>
  </div>
  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview :color="currentColor" :custom-classes="currentColor.customClasses" bubbleMotionEnter="none" />
  </div>

  <!-- カラーピッカー -->
  <div class="flex flex-wrap gap-4">
    <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-32">
      <label class="label">
        <span class="label-text">{{ label }}</span>
      </label>
      <input
        type="color"
        class="input input-bordered h-12 w-full"
        :value="currentColor[key]"
        @input="updateColorField(key, ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>

  <!-- カスタムクラス設定 -->
  <CustomClassSelector
    v-model="currentColor.customClasses"
    @update:modelValue="updateColorField('customClasses', $event)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import CustomClassSelector from './CustomClassSelector.vue'
  import CommentBubblePreview from '@ConfigComponents/displaySettings/CommentBubblePreview.vue'
  import { DEFAULT_COLOR_THEMES } from '@MainScripts/BotCharacter/CharacterColorPreset'
  import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
  import { Dices } from 'lucide-vue-next'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    modelValue?: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { selectedItemKey } = storeToRefs(omikujiStore)

  // labelとキーを配列で管理
  const colorFields = [
    { label: '名前の色', key: 'nameColor' },
    { label: 'テキストの色', key: 'textColor' },
    { label: '背景色', key: 'backgroundColor' },
  ] as const

  // 現在の色設定を取得
  const currentColor = computed(
    () =>
      props.modelValue ?? {
        nameColor: '#000000',
        textColor: '#000000',
        backgroundColor: '#ffffff',
        customClasses: '',
      }
  )

  // 色フィールドを更新する関数
  const updateColorField = (key: keyof CharacterColorType, value: string) => {
    if (!selectedItemKey.value) return

    // storeを使って更新
    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      [key]: value,
    })
  }

  // ランダム色設定の処理
  const handleRandomColor = () => {
    if (!selectedItemKey.value) return

    const result = drawOmikuji(DEFAULT_COLOR_THEMES)
    if (result) {
      omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
        ...result,
        customClasses: currentColor.value.customClasses,
      })
    }
  }
</script>
