<!-- src\ConfigMaker\components\componentEditor\bubble\BubbleComponentEditor.vue -->
<template>
  <div class="mx-auto">
    <!-- プレビュー表示 -->
    <CommentBubblePreview
      :color="localColor"
      :is-slider="true"
      :custom-classes="localColor.customClasses"
      :animated-text="bubble.bubbleTextAnimate"
      :animated-text-speed="bubble.bubbleTextSpeed"
      v-bind="bubble"
    />
  </div>

  <!-- デフォルトカラー設定 -->
  <SettingItem
    v-if="!isCharacter"
    label="デフォルトカラー設定"
    description="キャラクターが非表示の際はこのカラーが使用されます"
  >
    <ColorModeSelector
      :model-value="bubble.defaultColor"
      @update:model-value="(value) => updateFieldValue('defaultColor', value)"
    />
  </SettingItem>

  <!-- フキダシアニメーション -->
  <SettingItem label="フキダシアニメーション" description="フキダシの表示アニメーションを設定します" forceMode="pro">
    <select
      v-model="bubble.bubbleMotionEnter"
      :disabled="!isPro"
      @change="updateField('bubbleMotionEnter', $event)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="animation in motionLabel" :key="animation" :value="animation">
        {{ animation }}
      </option>
    </select>
  </SettingItem>

  <!-- フォントファミリー -->
  <SettingItem label="フォントファミリー" description="表示に使用するフォントを設定します" forceMode="pro">
    <select
      :value="bubble.fontFamily"
      @change="updateField('fontFamily', $event)"
      class="select bg-base text-base-content w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="font in fontFamilyOptions" :key="font" :value="font">
        {{ fontFamilyLabels[font] }}
      </option>
    </select>
  </SettingItem>

  <!-- 文字アニメーション有効化 -->
  <SettingItem
    label="文字アニメーション"
    description="文字を一文字ずつ表示する演出を有効にします"
    :showReset="true"
    @reset="() => resetField('bubbleTextAnimate')"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      v-model="bubble.bubbleTextAnimate"
      @change="updateField('bubbleTextAnimate', $event)"
    />
  </SettingItem>

  <div v-if="bubble.bubbleTextAnimate" class="space-y-4">
    <!-- 文字送り速度 -->
    <SettingItem
      label="文字送り速度"
      description="文字が表示される速度を調整します (10〜200)"
      :showReset="true"
      @reset="() => resetField('bubbleTextSpeed')"
    >
      <input
        type="range"
        min="10"
        max="200"
        step="10"
        class="range range-primary w-full max-w-xs"
        v-model.number="bubble.bubbleTextSpeed"
        @input="updateField('bubbleTextSpeed', $event)"
      />
      <div class="mt-2 text-sm">現在値: {{ bubble.bubbleTextSpeed }}ms</div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { fontFamilyOptions, fontFamilyLabels } from '@/types/MainGenerator/useFontFamily'
  import { SettingsBubbleSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import ColorModeSelector from '@ConfigComponents/characters/color/ColorModeSelector.vue'
  import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()
  const { isCharacter } = useVisibilityAccess()

  const bubble = computed(() => data.value.components.bubble)

  // 値を直接指定して更新する関数
  const updateFieldValue = <K extends keyof typeof bubble.value>(field: K, value: (typeof bubble.value)[K]) => {
    omikujiStore.updateNestedComponents('bubble', {
      ...bubble.value,
      [field]: value,
    })
  }

  // 単一の更新関数（イベントから値を取得）
  const updateField = (field: keyof typeof bubble.value, event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement
    const value =
      target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.type === 'range'
          ? Number(target.value)
          : target.value

    updateFieldValue(field, value as (typeof bubble.value)[typeof field])
  }

  // リセット関数
  const resetField = (field: keyof typeof bubble.value) => {
    if (field === 'defaultColor') return
    const defaults = SettingsBubbleSchema.parse({})
    updateFieldValue(field, defaults[field])
  }

  // ランダムカラー取得
  const localColor = computed(() => {
    const characters = data.value.characters
    const keys = Object.keys(characters)

    if (isCharacter.value && keys.length > 0) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      return characters[randomKey].color
    }

    return bubble.value.defaultColor
  })
</script>
