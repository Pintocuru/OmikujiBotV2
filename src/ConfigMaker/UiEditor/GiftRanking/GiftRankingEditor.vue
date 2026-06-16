<!-- src/ConfigMaker/UiEditor/GiftRanking/GiftRankingEditor.vue -->
<template>
  <!-- ランキングプレビュー -->
  <HudPreview :isAdminOnly="true">
    <div :class="[fontFamily]">
      <GiftRankingPreview :messages="[]" :settings="giftRanking" />
    </div>
  </HudPreview>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="giftRanking.component"
    :options="giftComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- テーマカラー -->
  <SettingItem v-if="isAdv" label="カラー" description="ランキングのテーマカラーを選択します" forceMode="adv">
    <select
      class="select select-bordered"
      :value="giftRanking.color"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- 表示オプション（isOption: true のコンポーネントのみ） -->
  <template v-if="currentComponentDef.isOption">
    <SettingItem label="表示項目" description="ランキングに表示する項目を選択します">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(opt, key) in giftDisplayOptionsMap"
          :key="key"
          class="badge badge-lg cursor-pointer whitespace-nowrap"
          :class="giftRanking.displayOptions.includes(key) ? 'badge-primary' : 'badge-outline'"
          @click="toggleDisplayOption(key)"
        >
          {{ opt.label }}
        </div>
      </div>
    </SettingItem>

    <SettingItem
      label="アイコンサイズ"
      description="中央に配置するアイコンの大きさを設定します"
      :showReset="true"
      @reset="resetField('iconSize')"
    >
      <div class="flex flex-col gap-2 w-full">
        <!-- スライダー -->
        <input
          type="range"
          min="16"
          max="512"
          step="8"
          class="range range-primary w-full"
          :value="giftRanking.iconSize ?? 128"
          @input="(e) => updateField('iconSize', Number((e.target as HTMLInputElement).value))"
        />

        <!-- 現在値の表示 -->
        <div class="text-right text-sm opacity-70">{{ giftRanking.iconSize ?? 80 }} px</div>
      </div>
    </SettingItem>
  </template>

  <!-- 順位のソート -->
  <SettingItem label="順位のソート" description="金額が高い順・新着順から選べます">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in giftSortOrderMap"
        :key="key"
        class="badge badge-lg cursor-pointer whitespace-nowrap"
        :class="giftRanking.sortOrder === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('sortOrder', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- 表示するランキング数 -->
  <SettingItem label="表示件数" description="表示する件数を設定" :showReset="true" @reset="resetField('rankingLimit')">
    <input
      type="number"
      min="1"
      :disabled="!isAdv"
      class="input input-bordered w-24"
      :value="giftRanking.rankingLimit"
      @input="(e) => updateField('rankingLimit', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- 最低金額 -->
  <SettingItem
    label="最低金額"
    description="この金額以上のギフトのみ表示"
    :showReset="true"
    @reset="resetField('minimumAmount')"
  >
    <input
      type="number"
      min="0"
      step="100"
      class="input input-bordered w-24"
      :value="giftRanking.minimumAmount"
      @input="(e) => updateField('minimumAmount', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    giftComponentMap,
    giftDisplayOptionsMap,
    giftSortOrderMap,
    GiftRankingSchema,
    GiftDisplayOption,
  } from '@/types'
  import { useFontFamily } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import GiftRankingPreview from './GiftRankingPreview.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv } = useSettingMode()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const giftRanking = computed(() => GiftRankingSchema.parse(data.value.components?.settings?.GiftRanking ?? {}))

  // 現在選択中のコンポーネント定義
  const currentComponentDef = computed(() => giftComponentMap[giftRanking.value.component])

  const updateField = (field: keyof ReturnType<typeof GiftRankingSchema.parse>, value: any) => {
    omikujiStore.updateComponentSettings('GiftRanking', {
      ...giftRanking.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof ReturnType<typeof GiftRankingSchema.parse>) => {
    const defaults = GiftRankingSchema.parse({})
    updateField(field, defaults[field])
  }

  const toggleDisplayOption = (key: GiftDisplayOption) => {
    const current = giftRanking.value.displayOptions
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    updateField('displayOptions', next)
  }
</script>
