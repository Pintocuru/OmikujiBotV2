<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <div class="flex justify-end gap-2">
    <!-- プリセットデータ -->
    <div v-if="!currentColor.isTheme">
      <button
        v-for="(theme, i) in DEFAULT_COLOR_THEMES"
        :key="i"
        class="w-8 h-8 rounded-full border border-base-content/20 hover:scale-110 transition"
        :style="{ backgroundColor: theme.nameColor }"
        @click="selectPresetColor(theme)"
      />
    </div>

    <!-- 新しいカラー設定へ移行 TODO:旧式にも変更できるよう、トグルにする -->
    <button @click="migrateToTheme" class="btn btn-secondary">新しいカラー設定へ移行</button>
  </div>

  <!-- プレビュー -->
  <div class="relative flex justify-center">
    <CommentBubblePreview :color="currentColor" :custom-classes="currentColor.customClasses" bubbleMotionEnter="none" />
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

  <!-- 新カラー -->
  <div v-else class="card bg-base-100 p-4 flex flex-col gap-4">
    <!-- テーマカラー -->
    <SettingItem label="カラー" description="ランキングのテーマカラーを選択します" :forceMode="'pro'">
      <select
        class="select select-bordered"
        :value="currentColor.daisyUiTheme"
        :disabled="!isPro"
        @change="(e) => updateColorField('daisyUiTheme', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="theme in themes" :key="theme" :value="theme">
          {{ theme }}
        </option>
      </select>
    </SettingItem>

    <!-- 背景の左端 -->
    <SettingItem label="背景(From)" description="背景カラーの左端の色を設定します" :forceMode="'pro'">
      <select
        class="select select-bordered"
        :value="currentColor.backFrom"
        @change="(e) => updateColorField('backFrom', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="color in daisyUIColor" :key="color" :value="color">
          {{ color }}
        </option>
      </select>
    </SettingItem>

    <!-- 背景の右端 -->
    <SettingItem label="背景(to)" description="背景カラーの右端の色を設定します" :forceMode="'pro'">
      <select
        class="select select-bordered"
        :value="currentColor.backTo"
        @change="(e) => updateColorField('backTo', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="color in daisyUIColor" :key="color" :value="color">
          {{ color }}
        </option>
      </select>
    </SettingItem>
  </div>

  <!-- カスタムクラス設定 -->
  <CustomClassSelector
    v-model="currentColor.customClasses"
    @update:modelValue="updateColorField('customClasses', $event)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import CustomClassSelector from '../CustomClass/CustomClassSelector.vue'
  import CommentBubblePreview from '@/ConfigMaker/components/displaySettings/bubble/CommentBubblePreview.vue'
  import { DEFAULT_COLOR_THEMES } from '@MainScripts/BotCharacter/CharacterColorPreset'
  import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
  import { Dices } from 'lucide-vue-next'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { daisyUIColor, themes } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    modelValue?: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { selectedItemKey } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // labelとキーを配列で管理
  const colorFields = [
    { label: '名前の色', key: 'nameColor' },
    { label: 'テキストの色', key: 'textColor' },
    { label: '背景色', key: 'backgroundColor' },
  ] as const

  // 現在の色設定を取得
  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  // 色フィールドを更新する関数
  const updateColorField = (key: keyof CharacterColorType, value: string) => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      [key]: value,
    })
  }

  // TODO:トグルスイッチにする
  const migrateToTheme = () => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      isTheme: false,
    })
  }

  const selectPresetColor = (theme: Partial<CharacterColorType>) => {
    if (!selectedItemKey.value) return
    if (!theme.nameColor || !theme.textColor || !theme.backgroundColor) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      nameColor: theme.nameColor,
      textColor: theme.textColor,
      backgroundColor: theme.backgroundColor,
    })
  }
</script>
