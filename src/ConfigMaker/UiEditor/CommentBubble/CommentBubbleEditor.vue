<!-- src/ConfigMaker/UiEditor/CommentBubble/CommentBubbleEditor.vue -->
<template>
  <!-- プレビュー表示 -->
  <HudPreview>
    <CommentBubblePreview
      :key="bubble.bubbleMotionEnter"
      :color="localColor"
      :fontFamily="commonStyle.fontFamily"
      :custom-classes="localColor.customClasses"
      :animated-text="bubble.bubbleTextAnimate"
      :animated-text-speed="bubble.bubbleTextSpeed"
      v-bind="bubble"
    />
  </HudPreview>
  <!-- デフォルトカラー設定 -->
  <template v-if="!isCharacter">
    <ColorModeSelector
      :model-value="commonStyle.defaultColor"
      @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
    />

    <InformationCard>
      <p>デフォルトカラーは、メイン表示・サブ表示共通です。</p>
    </InformationCard>
  </template>

  <!-- フキダシアニメーション -->
  <SettingItem label="フキダシアニメーション" description="フキダシの表示アニメーションを設定します" forceMode="pro">
    <select
      v-model="bubble.bubbleMotionEnter"
      @change="updateField('bubbleMotionEnter', $event)"
      class="select select-bordered w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="(value, key) in enterMotionMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>

  <!-- フォントファミリー -->
  <SettingItem v-if="isPro" label="フォントファミリー" description="表示に使用するフォントを設定します" forceMode="pro">
    <select
      :value="commonStyle.fontFamily"
      @change="updateFontFamily($event)"
      class="select bg-base text-base-content w-full max-w-xs"
    >
      <option v-for="(font, key) in fontFamilyMap" :key="key" :value="key">
        {{ font.label }}
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

  <template v-if="bubble.bubbleTextAnimate">
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
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CommentBubbleSchema } from '@/types'
  import { fontFamilyMap } from '@/types/MetaMaps/'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import { enterMotionMap } from '@/types/MetaMaps/enterMotionMaps'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()
  const { isCharacter } = useVisibilityAccess()
  const { characterArray } = useCharacterManager()
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const bubble = computed(() => data.value.components.settings.bubble ?? CommentBubbleSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // bubble設定の値を直接指定して更新する関数
  const updateFieldValue = <K extends keyof typeof bubble.value>(field: K, value: (typeof bubble.value)[K]) => {
    omikujiStore.updateComponentSettings('bubble', {
      [field]: value,
    })
  }

  // フォントファミリーの更新（commonStyleに移動）
  const updateFontFamily = (event: Event) => {
    const target = event.target as HTMLSelectElement
    updateCommonStyleField('fontFamily', target.value as (typeof commonStyle.value)['fontFamily'])
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
    const defaults = CommentBubbleSchema.parse({})
    updateFieldValue(field, defaults[field])
  }

  // 最初のキャラのカラー取得
  const localColor = computed(() => {
    if (!isCharacter.value) return data.value.components.commonStyle.defaultColor
    return characterArray.value[0].color
  })
</script>
