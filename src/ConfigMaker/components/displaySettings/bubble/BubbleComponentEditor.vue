<!-- src\ConfigMaker\components\displaySettings\components\BubbleComponentEditor.vue -->
<template>
  <div class="mx-auto">
    <!-- プレビュー表示 -->
    <CommentBubblePreview
      :color="localColor"
      :is-slider="true"
      :custom-classes="localColor.customClasses"
      :font-family="global.fontFamily"
      :animated-text="bubble.bubbleTextAnimate"
      :animated-text-speed="bubble.bubbleTextSpeed"
      v-bind="bubble"
    />
  </div>

  <!-- フキダシアニメーション -->
  <SettingItem
    label="フキダシアニメーション"
    description="フキダシの表示アニメーションを設定します"
    :showReset="true"
    @reset="() => resetField('bubbleMotionEnter')"
  >
    <select
      v-model="bubble.bubbleMotionEnter"
      @change="updateField('bubbleMotionEnter', $event)"
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
    @reset="() => resetField('bubbleTextAnimate')"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      v-model="bubble.bubbleTextAnimate"
      @change="updateField('bubbleTextAnimate', $event)"
    />
  </SettingItem>

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

  <!-- 文字送りサウンド -->
  <!-- TODO:サウンドからリストを持ってくる -->
  <SettingItem
    label="文字送りサウンド"
    description="文字送り時に再生するサウンドを選択します"
    :showReset="true"
    @reset="() => resetField('bubbleTextSound')"
  >
    <select
      v-model="bubble.bubbleTextSound"
      @change="updateField('bubbleTextSound', $event)"
      class="select select-bordered w-full max-w-xs"
    >
      <option value="">なし</option>
      <option value="typewriter">タイプライター</option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsBubbleSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { DEFAULT_COLOR_THEMES } from '@/MainGenerator/scripts/BotCharacter/CharacterColorPreset'
  import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const global = computed(() => data.value.displaySettings.global)
  const bubble = computed(() => data.value.displaySettings.components.bubble)

  // 単一の更新関数（型キャストを削減）
  const updateField = (field: keyof typeof bubble.value, event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement
    const value =
      target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.type === 'range'
          ? Number(target.value)
          : target.value

    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        [field]: value,
      },
    })
  }

  // リセット関数（簡潔化）
  const resetField = (field: keyof typeof bubble.value) => {
    const schemaDefaults = SettingsBubbleSchema.parse({})
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        [field]: schemaDefaults[field],
      },
    })
  }

  // ランダムカラー取得（キャッシュ可能なように分離）
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
