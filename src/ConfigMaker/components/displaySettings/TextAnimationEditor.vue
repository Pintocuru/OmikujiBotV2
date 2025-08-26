<!-- src/ConfigMaker/components/display/TextAnimationEditor.vue -->
<template>
  <!-- 基本表示設定 -->
  <SectionCard>
    <template #header>
      <div>文字・アニメーション</div>
      <div class="text-sm pr-2">フキダシの文字とアニメーションに関する設定です</div>
    </template>

    <template #body>
      <div class="mx-auto">
        <!-- プレビュー表示 -->
        <CommentBubblePreview
          :color="localColor"
          :is-slider="true"
          :text-size="base.displaySize"
          :custom-classes="localColor.customClasses"
          :font-family="base.fontFamily"
          :bubbleMotionEnter="base.bubbleMotionEnter"
          :bubbleMotionLeave="base.bubbleMotionLeave"
        />
      </div>
      <!-- 表示サイズ -->
      <SettingItem
        label="表示サイズ"
        description="コンテンツの表示サイズを設定します"
        :showReset="true"
        @reset="resetMap.displaySize"
      >
        <select
          :value="base.displaySize"
          @change="(e) => updateBaseField('displaySize', (e.target as HTMLSelectElement).value)"
          class="select select-bordered w-full max-w-xs"
        >
          <option v-for="size in displaySize" :key="size" :value="size">
            {{ displaySizeLabels[size] }}
          </option>
        </select>
      </SettingItem>

      <!-- フォントファミリー -->
      <SettingItem
        label="フォントファミリー"
        description="表示に使用するフォントを設定します"
        forceMode="pro"
        :showReset="true"
        @reset="resetMap.fontFamily"
      >
        <select
          :value="base.fontFamily"
          @change="(e) => updateBaseField('fontFamily', (e.target as HTMLSelectElement).value)"
          class="select bg-base text-base-content w-full max-w-xs"
          :disabled="!isPro"
        >
          <option v-for="font in fontFamilyOptions" :key="font" :value="font">
            {{ fontFamilyLabels[font] }}
          </option>
        </select>
      </SettingItem>

      <!-- フキダシアニメーション -->
      <SettingItem
        label="フキダシアニメーション(開始時)"
        description="フキダシの表示アニメーションを設定します"
        :showReset="true"
        @reset="resetMap.bubbleMotionEnter"
      >
        <select
          :value="base.bubbleMotionEnter"
          @change="(e) => updateBaseField('bubbleMotionEnter', (e.target as HTMLSelectElement).value)"
          class="select select-bordered w-full max-w-xs"
        >
          <option v-for="animation in motionLabel" :key="animation" :value="animation">
            {{ animation }}
          </option>
        </select>
      </SettingItem>

      <SettingItem
        label="フキダシアニメーション(終了時)"
        description="フキダシの表示アニメーションを設定します"
        :showReset="true"
        @reset="resetMap.bubbleMotionLeave"
      >
        <select
          :value="base.bubbleMotionLeave"
          @change="(e) => updateBaseField('bubbleMotionLeave', (e.target as HTMLSelectElement).value)"
          class="select select-bordered w-full max-w-xs"
        >
          <option v-for="animation in motionLabel" :key="animation" :value="animation">
            {{ animation }}
          </option>
        </select>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { displaySize, displaySizeLabels } from '@shared/types'
  import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { fontFamilyLabels } from '@/types/BotComponents/useFontFamily'
  import { DEFAULT_COLOR_THEMES } from '@/MainGenerator/scripts/BotCharacter/CharacterColorPreset'
  import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

  // 個別のcomputed値（読み取り専用）
  const base = computed(() => data.value.displaySettings.base)

  // 汎用的な更新関数
  const updateBaseField = (field: keyof typeof base.value, value: any) => {
    omikujiStore.updateDisplaySettings({
      base: {
        ...base.value,
        [field]: value,
      },
    })
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]
    updateBaseField(field, defaultValue)
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    displaySize: () => resetField('displaySize'),
    fontFamily: () => resetField('fontFamily'),
    bubbleMotionEnter: () => resetField('bubbleMotionEnter'),
    bubbleMotionLeave: () => resetField('bubbleMotionLeave'),
  }

  // キャラクターのカラー設定を取得
  const localColor = computed(() => {
    const characters = data.value.characters
    const characterKeys = Object.keys(characters)

    // キャラクターが存在する場合
    if (characterKeys.length > 0) {
      const randomKey = characterKeys[Math.floor(Math.random() * characterKeys.length)]
      return characters[randomKey].color
    }

    // キャラクターが存在しない場合、デフォルトカラーからランダムに選択
    const defaultColors = Object.values(DEFAULT_COLOR_THEMES)
    const randomDefaultColor = defaultColors[Math.floor(Math.random() * defaultColors.length)]
    return randomDefaultColor
  })
</script>
