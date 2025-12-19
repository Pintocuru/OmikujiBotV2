<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
  <div class="flex justify-between items-center gap-2">
    <!-- プリセットデータ -->
    <div v-if="!currentColor.isTheme" class="flex gap-2">
      <button
        v-for="(theme, i) in DEFAULT_COLOR_THEMES"
        :key="i"
        class="w-8 h-8 rounded-full border border-base-content/20 hover:scale-110 transition"
        :style="{ backgroundColor: theme.nameColor }"
        :title="`プリセット ${i + 1}`"
        @click="selectPresetColor(theme)"
      />
    </div>

    <!-- カラー設定モード切り替えトグル -->
    <div class="flex items-center gap-2">
      <!-- ランダム選択ボタン（新カラー設定時のみ表示） -->
      <button
        v-if="currentColor.isTheme"
        class="btn btn-sm btn-accent gap-2"
        :disabled="!isPro"
        @click="randomizeThemeColors"
        title="テーマとカラーをランダムに選択"
      >
        <Dices :size="16" />
        ランダム
      </button>

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

  <!-- 新：テーマベースのカラー設定 -->
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
        :disabled="!isPro"
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
        :disabled="!isPro"
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
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { daisyUIColor, themes } from '@shared/styles/DaisyUiTheme'
  import { Dices } from 'lucide-vue-next'

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

  // カラーモード切り替え（旧式⇔新式）
  const toggleColorMode = () => {
    if (!selectedItemKey.value) return

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      isTheme: !currentColor.value.isTheme,
    })
  }

  // プリセットカラー選択
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

  // ランダムにテーマカラーを選択
  const randomizeThemeColors = () => {
    if (!selectedItemKey.value) return

    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const randomBackFrom = daisyUIColor[Math.floor(Math.random() * daisyUIColor.length)]
    const randomBackTo = daisyUIColor[Math.floor(Math.random() * daisyUIColor.length)]

    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'color', {
      ...currentColor.value,
      daisyUiTheme: randomTheme,
      backFrom: randomBackFrom,
      backTo: randomBackTo,
    })
  }
</script>
