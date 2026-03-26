<!-- src/ConfigMaker/UiEditor/CommonStyle/DefaultColorEditor.vue -->
<template>
  <SubSectionHeader
    icon="Palette"
    title="デフォルトカラー"
    description="キャラクターモードがOFFの時のカラーを設定します"
  />

  <!-- プレビュー -->
  <div class="max-h-56 overflow-y-hidden" :class="[fontFamilyClass]">
    <FlashBannerSelector
      :settings="flashBannerSample"
      :message="flashBannerSample.defaultMessage"
      :layers="[]"
      :color="commonStyle.defaultColor"
    />
  </div>

  <!-- デフォルトカラー設定 -->
  <ColorModeSelector
    :model-value="commonStyle.defaultColor"
    @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
  />

  <!-- デフォルトカラー設定 -->
  <SubSectionHeader icon="Notebook" title="デフォルト投稿" description="デフォルトの投稿の挙動を設定します" />
  <CommentVoiceSettings
    :modelValue="commonStyle.defaultVoice"
    :backgroundColor="commonStyle.defaultColor.backgroundColor"
    :onUpdate="(value) => updateCommonStyleField('defaultVoice', value)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { FlashBannerSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import FlashBannerSelector from '@main/ui/FlashBanner/parts/FlashBannerSelector.vue'
  import { useCommonStyleUpdate } from './useCommonStyleUpdate'
  import CommentVoiceSettings from '@config/components/characters/service/CommentVoiceSettings.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const commonStyle = computed(() => data.value.components.commonStyle)

  const fontFamilyKey = computed(() => data.value.components.commonStyle.fontFamily ?? 'default')
  const fontFamilyClass = computed(() => useFontFamily(fontFamilyKey.value))

  const flashBannerSample = computed(() =>
    FlashBannerSchema.parse({
      component: 'glass',
      label: 'Sample',
      defaultMessage: 'テストです',
    })
  )
</script>
