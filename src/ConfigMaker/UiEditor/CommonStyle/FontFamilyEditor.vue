<!-- src/ConfigMaker/UiEditor/CommonStyle/FontFamilyEditor.vue -->
<template>
  <!-- プレビュー -->
  <div class="mb-4 p-4 rounded-box border bg-base-200" :class="[fontFamilyClass]">
    <div class="text-3xl font-bold mb-1">プレビュータイトル</div>
    <div class="text-lg leading-relaxed">これはフォント確認用のサンプルです。ABC abc 123 あいうえお アイウエオ</div>
  </div>

  <!-- フォントファミリー -->
  <SettingItem label="フォントファミリー" description="表示に使用するフォントを設定します" forceMode="pro">
    <div class="w-full space-y-3">
      <!-- カテゴリタブ -->
      <div role="tablist" class="tabs tabs-bordered tabs-sm w-full">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          role="tab"
          class="tab"
          :class="{ 'tab-active': activeCategory === tab.key }"
          @click="activeCategory = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- フォントカードグリッド -->
      <div class="grid grid-cols-2 gap-2">
        <!-- デフォルト（すべてタブのみ） -->
        <button
          v-if="activeCategory === 'all'"
          class="flex flex-col items-start gap-1 p-3 rounded-box border cursor-pointer transition-colors text-left w-full"
          :class="
            fontFamilyKey === 'default'
              ? 'border-primary bg-primary/10'
              : 'border-base-300 bg-base-100 hover:bg-base-200'
          "
          @click="selectFont('default')"
        >
          <span class="text-xs text-base-content/60 leading-none">デフォルト</span>
          <span class="text-2xl leading-none text-base-content">あAa漢</span>
        </button>

        <!-- フォントカード -->
        <button
          v-for="[key, font] in filteredFonts"
          :key="key"
          class="flex flex-col items-start gap-1 p-3 rounded-box border cursor-pointer transition-colors text-left w-full"
          :class="[
            font.className,
            fontFamilyKey === key ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-100 hover:bg-base-200',
          ]"
          @click="selectFont(key)"
        >
          <span
            class="text-xs text-base-content/60 leading-none"
            style="font-family: ui-sans-serif, system-ui, sans-serif"
          >
            {{ font.label }}
          </span>
          <span class="text-2xl leading-none text-base-content">あAa漢</span>
        </button>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { FontFamilyType, fontFamilyMap, useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useCommonStyleUpdate } from './useCommonStyleUpdate'

  type FontCategory = 'gothic' | 'mincho' | 'rounded' | 'handwriting' | 'display'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const fontFamilyKey = computed(() => data.value.components.commonStyle.fontFamily ?? 'default')
  const fontFamilyClass = computed(() => useFontFamily(fontFamilyKey.value))

  const activeCategory = ref<'all' | FontCategory>('all')

  const TABS: { key: 'all' | FontCategory; label: string }[] = [
    { key: 'all', label: 'すべて' },
    { key: 'gothic', label: 'ゴシック' },
    { key: 'mincho', label: '明朝' },
    { key: 'rounded', label: '丸ゴシック' },
    { key: 'handwriting', label: '手書き' },
    { key: 'display', label: '装飾' },
  ]

  const filteredFonts = computed(() => {
    return (Object.entries(fontFamilyMap) as [FontFamilyType, (typeof fontFamilyMap)[FontFamilyType]][]).filter(
      ([key, font]) => {
        if (key === 'default') return false
        if (activeCategory.value === 'all') return true
        return font.category === activeCategory.value
      }
    )
  })

  const selectFont = (key: string) => {
    updateCommonStyleField('fontFamily', key as FontFamilyType)
  }
</script>
