<!-- src/ConfigMaker/UiEditor/CommentSpin/CommentSpinEditor.vue -->
<template>
  <!-- プレビュー -->
  <CommentSpinPreview
    :key="`${commentSpin.component}-${commentSpin.animation}-${commentSpin.durationSeconds}`"
    :settings="commentSpin"
  />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="commentSpin.component"
    :options="spinComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- デフォルトカラー設定 -->
  <ColorModeSelector
    :model-value="commonStyle.defaultColor"
    @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
  />

  <!-- サイズ設定 -->
  <SettingItem label="表示サイズ" description="ルーレットの幅と高さを調整します（px）">
    <div class="flex flex-col gap-4">
      <!-- 幅 -->
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>幅 (Width)</span>
          <span>{{ commentSpin.size.width }}px</span>
        </div>

        <input
          type="range"
          min="160"
          max="640"
          step="4"
          class="range range-primary"
          :value="commentSpin.size.width"
          @input="(e) => updateSize('width', Number((e.target as HTMLInputElement).value))"
        />
      </div>

      <!-- 高さ -->
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>高さ (Height)</span>
          <span>{{ commentSpin.size.height }}px</span>
        </div>

        <input
          type="range"
          min="64"
          max="640"
          step="4"
          class="range range-secondary"
          :value="commentSpin.size.height"
          @input="(e) => updateSize('height', Number((e.target as HTMLInputElement).value))"
        />
      </div>
    </div>
  </SettingItem>

  <!-- 再生時間設定 -->
  <SettingItem label="回転の再生時間" description="アニメーションの再生時間（秒）">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs">
        <span>{{ commentSpin.durationSeconds }}s</span>
      </div>

      <input
        type="range"
        min="0.5"
        max="5"
        step="0.1"
        class="range range-accent"
        :value="commentSpin.durationSeconds"
        @input="(e) => updateField('durationSeconds', Number((e.target as HTMLInputElement).value))"
      />
    </div>
  </SettingItem>

  <!-- アニメーション選択 -->
  <SettingItem
    v-if="Object.keys(filterSpinAnimationMap).length > 1"
    label="アニメーション"
    description="ルーレットの回転演出を選択します"
  >
    <select
      class="select select-bordered w-full"
      :value="commentSpin.animation"
      @change="(e) => updateField('animation', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="(opt, key) in filterSpinAnimationMap" :key="key" :value="key">
        {{ opt?.label }}
      </option>
    </select>
  </SettingItem>

  <!-- タイトルロゴ設定 -->
  <SettingItem label="タイトルロゴパス" description="characters フォルダ内の画像パスを指定">
    <input
      type="text"
      class="input input-bordered w-full font-mono text-sm"
      :value="commentSpin.logoPath"
      placeholder="例: chocolate/titleLogo.webp"
      @input="(e) => updateField('logoPath', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CommentSpinSchema, spinAnimationMap, spinComponentMap } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import CommentSpinPreview from './CommentSpinPreview.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'
  import { useVisibleOptions } from '../CommonStyle/useVisibleOptions'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateCommonStyleField } = useCommonStyleUpdate()
  const { visibleOptions: filterSpinAnimationMap } = useVisibleOptions(spinAnimationMap)

  const commentSpin = computed(() => data.value.components.settings.commentSpin ?? CommentSpinSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // Field Updates
  const updateField = (field: keyof typeof commentSpin.value, value: any) => {
    omikujiStore.updateComponentSettings('commentSpin', {
      ...commentSpin.value,
      [field]: value,
    })
  }
  const updateSize = (key: 'width' | 'height', value: number) => {
    omikujiStore.updateComponentSettings('commentSpin', {
      ...commentSpin.value,
      size: {
        ...commentSpin.value.size,
        [key]: value,
      },
    })
  }
</script>
