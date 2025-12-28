<!-- src/configMaker/components/characters/ColorModeSelector.vue -->
<template>
  <!-- カラー設定 -->
  <div class="flex justify-between items-center gap-2">
    <!-- プリセットデータ -->
    <div v-if="!colorValue.isTheme" class="flex gap-2">
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
      <RandomThemeButton v-if="isAdv && colorValue.isTheme" @randomize="handleRandomTheme" />

      <div class="form-control">
        <label class="label cursor-pointer gap-3">
          <span class="label-text">{{ colorValue.isTheme ? '旧カラー設定' : '新カラー設定' }}</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="colorValue.isTheme"
            @change="toggleColorMode"
          />
        </label>
      </div>
    </div>
  </div>

  <!-- 旧：カラーピッカーを表示 -->
  <div v-if="!colorValue.isTheme" class="flex flex-wrap gap-4">
    <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-32">
      <label class="label">
        <span class="label-text">{{ label }}</span>
      </label>
      <input
        type="color"
        class="input input-bordered h-12 w-full"
        :value="colorValue[key]"
        @input="updateColorField(key, ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>

  <!-- 新：テーマベースのカラー設定 -->
  <div v-else class="card bg-base-100 p-4 flex flex-col gap-4">
    <DaisyUiThemeEditor :model-value="themeFields" @update:model-value="handleThemeUpdate" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import { DEFAULT_COLOR_THEMES } from '@MainScripts/BotCharacter/CharacterColorPreset'
  import DaisyUiThemeEditor from './DaisyUiThemeEditor.vue'
  import RandomThemeButton from './RandomThemeButton.vue'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const { isAdv } = useSettingMode()

  // カラーフィールド定義
  const colorFields = [
    { label: '名前の色', key: 'nameColor' },
    { label: 'テキストの色', key: 'textColor' },
    { label: '背景色', key: 'backgroundColor' },
  ] as const

  // 現在の色設定
  const colorValue = computed(() => props.modelValue)

  // DaisyUIテーマフィールドのみ抽出
  const themeFields = computed<DaisyUiThemeFieldsType>(() => ({
    daisyUiTheme: colorValue.value.daisyUiTheme,
    backFrom: colorValue.value.backFrom,
    backTo: colorValue.value.backTo,
  }))

  // 色設定を更新する共通関数
  const updateColor = (updates: Partial<CharacterColorType>) => {
    emit('update:modelValue', {
      ...colorValue.value,
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
    updateColor({ isTheme: !colorValue.value.isTheme })
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
