<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>カラー設定</div>
      <div class="text-sm pr-2">フキダシのカラーの編集を行います。</div>
    </template>

    <template #body>
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
        <CommentBubblePreview
          :color="currentColor"
          :custom-classes="currentColor.customClasses"
          bubbleMotionEnter="none"
        />
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
      <SettingItem
        label="カスタムTailwindクラス"
        description="グラデーション背景、ボーダー、影などを追加できます"
        :showReset="true"
        @reset="updateColorField('customClasses', 'border-2 border-white')"
      >
        <input
          type="text"
          placeholder="例: bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"
          class="input input-bordered w-full"
          :value="currentColor.customClasses"
          @input="updateColorField('customClasses', ($event.target as HTMLInputElement).value)"
        />
        <label class="label">
          <span class="label-text-alt"></span>
        </label>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
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
  const { selectedRuleId } = storeToRefs(omikujiStore)

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
    if (!selectedRuleId.value) return

    // storeを使って更新
    omikujiStore.updateRecordProperty('characters', selectedRuleId.value, 'color', {
      ...currentColor.value,
      [key]: value,
    })
  }

  // ランダム色設定の処理
  const handleRandomColor = () => {
    if (!selectedRuleId.value) return

    const result = drawOmikuji(DEFAULT_COLOR_THEMES)
    if (result) {
      omikujiStore.updateRecordProperty('characters', selectedRuleId.value, 'color', {
        ...result,
        customClasses: currentColor.value.customClasses,
      })
    }
  }
</script>
