<!-- src\ConfigMaker\components\displaySettings\components\BubbleComponentEditor.vue -->
<template>
  <div class="mx-auto">
    <!-- プレビュー表示 -->
    <CommentBubblePreview
      :color="localColor"
      :is-slider="true"
      :custom-classes="localColor.customClasses"
      :font-family="global.fontFamily"
      :bubbleMotionEnter="bubble.bubbleMotionEnter"
      :bubbleMotionLeave="bubble.bubbleMotionLeave"
      :bubbleTextAnimate="bubble.bubbleTextAnimate"
      :bubbleTextSpeed="bubble.bubbleTextSpeed"
      :bubbleTextSound="bubble.bubbleTextSound"
    />
  </div>

  <!-- フキダシアニメーション -->
  <SettingItem
    label="フキダシアニメーション(開始時)"
    description="フキダシの表示アニメーションを設定します"
    :showReset="true"
    @reset="resetMap.bubbleMotionEnter"
  >
    <select
      :value="bubble.bubbleMotionEnter"
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
    description="フキダシの非表示アニメーションを設定します"
    :showReset="true"
    @reset="resetMap.bubbleMotionLeave"
  >
    <select
      :value="bubble.bubbleMotionLeave"
      @change="(e) => updateBaseField('bubbleMotionLeave', (e.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="animation in motionLabel" :key="animation" :value="animation">
        {{ animation }}
      </option>
    </select>
  </SettingItem>

  <!-- 文字アニメーション有効化 -->
  <SettingItem
    label="文字アニメーション"
    description="文字を一文字ずつ表示する演出を有効にします"
    :showReset="true"
    @reset="resetMap.bubbleTextAnimate"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="bubble.bubbleTextAnimate"
      @change="(e) => updateBaseField('bubbleTextAnimate', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- 文字送り速度 -->
  <SettingItem
    label="文字送り速度"
    description="文字が表示される速度を調整します (10〜200)"
    :showReset="true"
    @reset="resetMap.bubbleTextSpeed"
  >
    <input
      type="range"
      min="10"
      max="200"
      step="10"
      class="range range-primary w-full max-w-xs"
      :value="bubble.bubbleTextSpeed"
      @input="(e) => updateBaseField('bubbleTextSpeed', Number((e.target as HTMLInputElement).value))"
    />
    <div class="mt-2 text-sm">現在値: {{ bubble.bubbleTextSpeed }}ms</div>
  </SettingItem>

  <!-- 文字送りサウンド -->
  <!-- TODO:サウンドからリストを持ってくる -->
  <SettingItem
    label="文字送りサウンド"
    description="文字送り時に再生するサウンドを選択します"
    :showReset="true"
    @reset="resetMap.bubbleTextSound"
  >
    <select
      :value="bubble.bubbleTextSound || ''"
      @change="(e) => updateBaseField('bubbleTextSound', (e.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option value="">なし</option>
      <option value="typewriter">タイプライター</option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import CommentBubblePreview from '../CommentBubblePreview.vue'
  import { storeToRefs } from 'pinia'
  import { DEFAULT_COLOR_THEMES } from '@/MainGenerator/scripts/BotCharacter/CharacterColorPreset'
  import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { SettingsBubbleSchema } from '@/types/OmikujiData/DisplaySettingsSchema'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

  const global = computed(() => data.value.displaySettings.global)
  const bubble = computed(() => data.value.displaySettings.components.bubble)

  const updateBaseField = (field: keyof typeof bubble.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        [field]: value,
      },
    })
  }

  const resetField = (field: keyof typeof bubble.value) => {
    const schemaDefaults = SettingsBubbleSchema.parse({})
    updateBaseField(field, schemaDefaults[field])
  }

  const resetMap = {
    bubbleMotionEnter: () => resetField('bubbleMotionEnter'),
    bubbleMotionLeave: () => resetField('bubbleMotionLeave'),
    bubbleTextAnimate: () => resetField('bubbleTextAnimate'),
    bubbleTextSpeed: () => resetField('bubbleTextSpeed'),
    bubbleTextSound: () => resetField('bubbleTextSound'),
  }

  const localColor = computed(() => {
    const characters = data.value.characters
    const keys = Object.keys(characters)
    if (keys.length > 0) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      return characters[randomKey].color
    }
    const defaults = Object.values(DEFAULT_COLOR_THEMES)
    return defaults[Math.floor(Math.random() * defaults.length)]
  })
</script>
