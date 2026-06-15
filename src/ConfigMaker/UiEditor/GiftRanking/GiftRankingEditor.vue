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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    <SettingItem
      label="表示件数"
      description="ランキングに表示する件数を設定します（最大100）"
      :forceMode="'pro'"
      :showReset="true"
      @reset="resetField('rankingLimit')"
    >
      <input
        type="number"
        min="1"
        max="100"
        :disabled="!isAdv"
        class="input input-bordered w-24"
        :value="giftRanking.rankingLimit"
        @input="(e) => updateField('rankingLimit', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <!-- 最低金額 -->
    <SettingItem
      label="最低金額"
      description="この金額以上のギフトのみランキングに表示します"
      :showReset="true"
      @reset="resetField('minimumAmount')"
    >
      <input
        type="number"
        min="0"
        class="input input-bordered w-24"
        :value="giftRanking.minimumAmount"
        @input="(e) => updateField('minimumAmount', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { giftComponentMap, giftSortOrderMap, GiftRankingSchema } from '@/types'
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
</script>
