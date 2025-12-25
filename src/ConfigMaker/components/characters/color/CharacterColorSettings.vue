<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <div class="flex justify-between items-center gap-2">
    <!-- プリセットデータ -->
    <div v-if="!currentColor.isTheme" class="flex gap-2">
      <button
        v-for="(theme, i) in DEFAULT_COLOR_THEMES"
        :key="i"
        class="w-8 h-8 rounded-full border border-base-content/20 hover:scale-110 transition"
        :style="{ backgroundColor: theme.backgroundColor }"
        :title="`プリセット ${i + 1}`"
        @click="selectPresetColor(theme)"
      />
    </div>

    <!-- カラー設定モード切り替えトグル -->
    <div class="flex items-center gap-2">
      <!-- ランダム選択ボタン（新カラー設定時のみ表示） -->
      <RandomThemeButton v-if="isPro && currentColor.isTheme" @randomize="handleRandomTheme" />

      <div class="form-control">
        <label class="label cursor-pointer gap-3">
          <span class="label-text">{{ currentColor.isTheme ? '旧カラー設定' : '新カラー設定' }}</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="currentColor.isTheme"
            @change="toggleColorMode"
          />
        </label>
      </div>
    </div>
  </div>

  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview
      :botName="botName"
      :color="currentColor"
      :custom-classes="currentColor.customClasses"
      bubbleMotionEnter="none"
    />
  </div>

  <!-- 旧：カラーピッカーを表示 -->
  <div v-if="!currentColor.isTheme" class="flex flex-wrap gap-4">
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

  <!-- 新：テーマベースのカラー設定 -->
  <div v-else class="card bg-base-100 p-4 flex flex-col gap-4">
    <DaisyUiThemeEditor :model-value="themeFields" @update:model-value="handleThemeUpdate" />
  </div>

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
  import { DEFAULT_COLOR_THEMES } from '@MainScripts/BotCharacter/CharacterColorPreset'
  import DaisyUiThemeEditor from './DaisyUiThemeEditor.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import RandomThemeButton from './RandomThemeButton.vue'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

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
  const { isPro, isGod } = useSettingMode()

  // カラーフィールド定義
  const colorFields = [
    { label: '名前の色', key: 'nameColor' },
    { label: 'テキストの色', key: 'textColor' },
    { label: '背景色', key: 'backgroundColor' },
  ] as const

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // DaisyUIテーマフィールドのみ抽出
  const themeFields = computed<DaisyUiThemeFieldsType>(() => ({
    daisyUiTheme: currentColor.value.daisyUiTheme,
    backFrom: currentColor.value.backFrom,
    backTo: currentColor.value.backTo,
  }))

  // 色設定を更新する共通関数
  const updateColor = (updates: Partial<CharacterColorType>) => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      ...updates,
    })
  }

  // 個別フィールド更新
  const updateColorField = (key: keyof CharacterColorType, value: string) => {
    updateColor({ [key]: value })
  }

  // テーマ更新ハンドラー
  const handleThemeUpdate = (newValue: DaisyUiThemeFieldsType) => {
    updateColor(newValue)
  }

  // ランダムテーマ選択ハンドラー
  const handleRandomTheme = (newValues: DaisyUiThemeFieldsType) => {
    updateColor(newValues)
  }

  // カラーモード切り替え（旧式⇔新式）
  const toggleColorMode = () => {
    updateColor({ isTheme: !currentColor.value.isTheme })
  }

  // プリセットカラー選択
  const selectPresetColor = (theme: Partial<CharacterColorType>) => {
    if (!theme.nameColor || !theme.textColor || !theme.backgroundColor) return

    updateColor({
      nameColor: theme.nameColor,
      textColor: theme.textColor,
      backgroundColor: theme.backgroundColor,
    })
  }
</script>
