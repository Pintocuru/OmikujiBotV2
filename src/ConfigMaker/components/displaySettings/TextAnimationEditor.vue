<!-- src/ConfigMaker/components/display/TextAnimationEditor.vue -->
<template>
  <!-- 基本表示設定 -->
  <SectionCard>
    <template #header>
      <div>文字・アニメーション</div>
    </template>

    <template #body>
      <!-- プレビュー表示 -->
      <CommentBubblePreview
        :color="localColor"
        :text-size="base.displaySize"
        :custom-classes="localColor.customClasses"
        :font-family="base.fontFamily"
        :bubbleMotionEnter="base.bubbleMotionEnter"
        :bubbleMotionLeave="base.bubbleMotionLeave"
      />

      <!-- 表示サイズ -->
      <SettingItem label="表示サイズ" description="コンテンツの表示サイズを設定します" @reset="resetMap.displaySize">
        <select v-model="base.displaySize" class="select select-bordered w-full max-w-xs">
          <option v-for="size in displaySize" :key="size" :value="size">
            {{ displaySizeLabels[size] }}
          </option>
        </select>
      </SettingItem>

      <!-- フォントファミリー -->
      <SettingItem
        label="フォントファミリー"
        description="表示に使用するフォントを設定します"
        @reset="resetMap.fontFamily"
      >
        <select v-model="base.fontFamily" class="select select-bordered w-full max-w-xs">
          <option value="">デフォルト</option>
          <option v-for="font in fontFamilyOptions" :key="font" :value="font">
            {{ fontFamilyLabels[font] }}
          </option>
        </select>
      </SettingItem>

      <!-- フキダシアニメーション -->
      <SettingItem
        label="フキダシアニメーション(開始時)"
        description="フキダシの表示アニメーションを設定します"
        @reset="resetMap.bubbleMotionEnter"
      >
        <select v-model="base.bubbleMotionEnter" class="select select-bordered w-full max-w-xs">
          <option v-for="animation in motionLabel" :key="animation" :value="animation">
            {{ animation }}
          </option>
        </select>
      </SettingItem>

      <SettingItem
        label="フキダシアニメーション(終了時)"
        description="フキダシの表示アニメーションを設定します"
        @reset="resetMap.bubbleMotionEnter"
      >
        <select v-model="base.bubbleMotionLeave" class="select select-bordered w-full max-w-xs">
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

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 基本設定の参照
  const base = computed({
    get: () => data.value.displaySettings.base,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        base: {
          ...data.value.displaySettings.base,
          ...newValue,
        },
      })
    },
  })

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]

    base.value = {
      ...base.value,
      [field]: defaultValue,
    }
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    displaySize: () => resetField('displaySize'),
    fontFamily: () => resetField('fontFamily'),
    bubbleMotionEnter: () => resetField('bubbleMotionEnter'),
  }

  // キャラクターのカラー設定を取得
  // TODO:charactersからランダムでデータを取得し、そのcolorを表示したい
  // reimu は必ず存在するわけではないため、TypeError: Cannot read properties of undefined (reading 'color') が出ている
  // characters が0である場合、DEFAULT_COLOR_THEMES からランダムで取得
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
