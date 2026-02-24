<!-- src/ConfigMaker/components/componentEditor/CommonStyle/FontFamilyEditor.vue -->
<template>
  <!-- プレビュー表示 -->
  <div class="mb-6 p-4 rounded-box border bg-base-200" :class="[fontFamilyClass]">
    <div class="text-xl font-bold mb-2">プレビュータイトル</div>
    <div class="leading-relaxed">これはフォント確認用のサンプル文章です。 ABC abc 123 あいうえお アイウエオ</div>
  </div>

  <!-- フォントファミリー -->
  <SettingItem label="フォントファミリー" description="表示に使用するフォントを設定します" forceMode="pro">
    <select
      :value="fontFamilyKey"
      @change="updateFontFamily($event)"
      class="select bg-base text-base-content w-full max-w-xs"
    >
      <option v-for="(font, key) in fontFamilyMap" :key="key" :value="key">
        {{ font.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { FontFamilyType, fontFamilyMap, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useCommonStyleUpdate } from './useCommonStyleUpdate'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const fontFamilyKey = computed(() => data.value.components.commonStyle.fontFamily ?? 'default')
  const fontFamilyClass = computed(() => useFontFamily(fontFamilyKey.value))

  // フォントファミリーの更新（commonStyleに移動）
  const updateFontFamily = (event: Event) => {
    const target = event.target as HTMLSelectElement
    updateCommonStyleField('fontFamily', target.value as FontFamilyType)
  }
</script>
