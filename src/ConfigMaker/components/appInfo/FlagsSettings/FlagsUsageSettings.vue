<!-- src/ConfigMaker/components/appInfo/FlagsSettings/FlagsUsageSettings.vue -->
<template>
  <SubSectionHeader icon="Palette" title="Recordアイテム表示" description="アイテムの表示・非表示を制御" />

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingItem
      v-for="category in recordCategoryLabel"
      :key="category"
      :label="categoryMap[category].label"
      :description="category"
      :variant="getVariant(category)"
    >
      <div class="flex flex-col gap-2">
        <!-- アクセスレベル選択 -->
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input
              v-model="categoryVisibility(category).value"
              :value="level"
              type="radio"
              class="radio radio-warning radio-sm"
            />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
        <!-- 件数 + 削除ボタン -->
        <div class="flex items-center justify-between gap-2">
          <span
            class="text-xs opacity-60"
            :class="getCount(category) > 0 && categoryVisibility(category).value === 'none' ? 'badge badge-error' : ''"
          >
            {{ getCount(category) }} 件
          </span>
          <button
            v-if="categoryVisibility(category).value === 'none' && getCount(category) > 0"
            class="btn btn-xs btn-error btn-outline"
            @click="handleClear(category)"
          >
            全件削除
          </button>
        </div>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { categoryMap, recordCategoryLabel, RecordCategoryType } from '@/types'
  import { AccessLevelLabels } from '@shared/types'
  import { useFlagsSettings } from './useFlagsSettings'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import type { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const { categoryVisibility } = useFlagsSettings()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const levelVariantMap: Record<(typeof AccessLevelLabels)[number], DaisyUIColorType | null> = {
    none: 'neutral',
    basic: null,
    adv: 'info',
    pro: 'accent',
    godMode: 'warning',
  }

  const getVariant = (category: RecordCategoryType): DaisyUIColorType | null => {
    const level = categoryVisibility(category).value
    return levelVariantMap[level]
  }

  const getCount = (category: RecordCategoryType): number => Object.keys(data.value[category]).length

  const handleClear = async (category: RecordCategoryType) => {
    const label = categoryMap[category].label
    const count = getCount(category)
    const result = await swalModal.confirmDelete({
      title: `${label} を全件削除しますか？`,
      text: `${count} 件のデータが削除されます。この操作は取り消せません`,
    })
    if (result.isConfirmed) {
      omikujiStore.clearCategory(category)
    }
  }
</script>
