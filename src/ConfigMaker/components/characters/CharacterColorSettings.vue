<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>カラー設定</div>
      <!-- ランダムボタン -->
      <div class="tooltip tooltip-bottom" data-tip="ランダムな色テーマに変更">
        <button @click="handleRandomColor" class="btn btn-ghost btn-sm">
          <Dices class="w-4 h-4" />
          カラーシャッフル
        </button>
      </div>
    </template>

    <template #body>
      <!-- プレビュー -->
      <div class="relative flex justify-center">
        <CommentBubblePreview :color="localData" :custom-classes="localData.customClasses" bubbleMotionEnter="none" />
      </div>

      <!-- カラーピッカー -->
      <div class="flex flex-wrap gap-4">
        <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-32">
          <label class="label">
            <span class="label-text">{{ label }}</span>
          </label>
          <input type="color" class="input input-bordered h-12 w-full" v-model="localData[key]" />
        </div>
      </div>

      <!-- カスタムクラス設定 -->
      <SettingItem
        label="カスタムTailwindクラス"
        description="グラデーション背景、ボーダー、影などを追加できます"
        @reset="localData.customClasses = 'border-2 border-white'"
      >
        <input
          type="text"
          placeholder="例: bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"
          class="input input-bordered w-full"
          v-model="localData.customClasses"
        />
        <label class="label">
          <span class="label-text-alt"></span>
        </label>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import CommentBubblePreview from '@ConfigComponents/displaySettings/CommentBubblePreview.vue'
  import { DEFAULT_COLOR_THEMES } from '@MainScripts/BotCharacter/CharacterColorPreset'
  import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
  import { Dices } from 'lucide-vue-next'

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // labelとキーを配列で管理
  const colorFields = [
    { label: '名前の色', key: 'nameColor' },
    { label: 'テキストの色', key: 'textColor' },
    { label: '背景色', key: 'backgroundColor' },
  ] as const

  // v-modelを使用したlocalColorの実装
  const localData = computed({
    get: () => props.modelValue,
    set: (value: CharacterColorType) => {
      emit('update:modelValue', value)
    },
  })

  // propsからlocalColorを更新
  watch(
    () => props.modelValue,
    (newValue) => {
      // ここで全体を置き換えず、フィールドごとに更新
      for (const key in newValue) {
        ;(localData.value as any)[key] = (newValue as any)[key]
      }
      if (!newValue.customClasses) {
        localData.value.customClasses = ''
      }
    },
    { deep: true }
  )

  // localColorの変更を親に通知
  watch(
    localData,
    (newValue) => {
      emit('update:modelValue', newValue)
    },
    { deep: true }
  )

  // ランダム色設定の処理
  const handleRandomColor = () => {
    const result = drawOmikuji(DEFAULT_COLOR_THEMES)
    if (result) {
      localData.value = {
        ...result,
        customClasses: localData.value.customClasses,
      }
    }
  }
</script>
