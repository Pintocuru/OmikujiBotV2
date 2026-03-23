<!-- src/ConfigMaker/components/events/OmikujiItem/OmikujiItemPriority.vue -->
<template>
  <template v-if="omikujiItem">
    <!-- 追加発動条件の有効化 -->
    <SettingItem
      label="追加発動条件を設定する"
      description="条件を満たした場合の優先度を設定できます"
      :variant="hasCriteria ? 'secondary' : undefined"
    >
      <label class="label cursor-pointer gap-2">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="hasCriteria"
          @change="toggleCriteria(($event.target as HTMLInputElement).checked)"
        />
        <span class="label-text">設定する</span>
      </label>
    </SettingItem>

    <!-- 優先度 -->
    <template v-if="hasCriteria">
      <SubSectionHeader icon="Filter" title="追加条件" description="このおみくじが適用される追加の条件を設定します" />
      <SettingItem label="優先度" description="追加条件達成時、優先で選ばれます">
        <label class="label cursor-pointer gap-2">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="omikujiItem.isPriority"
            @change="updatePriority(($event.target as HTMLInputElement).checked)"
          />
          <span class="label-text">
            {{ omikujiItem.isPriority ? '適用時、このおみくじが必ず適用されます' : '他のおみくじと同じ抽選を行います' }}
          </span>
        </label>
      </SettingItem>

      <!-- 発動条件 -->
      <OmikujiItemCriteria :index="index" :omikuji="omikujiItem" :selectedItemKey="selectedItemKey" />
    </template>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType, CriteriaThresholdSchema } from '@/types/OmikujiData/'
  import OmikujiItemCriteria from './OmikujiItemCriteria.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const props = defineProps<{
    selectedItemKey: string | null
    omikujiItem: OmikujiItemType | null
    index: number
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()

  // criteriaが設定されているか
  const hasCriteria = computed(() => props.omikujiItem?.criteria !== null)

  // 優先度更新
  const updatePriority = (value: boolean) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex('comments', props.selectedItemKey, props.index, (item) => ({
      ...item,
      isPriority: value,
    }))
  }

  // criteriaのトグル
  const toggleCriteria = (enabled: boolean) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex('comments', props.selectedItemKey, props.index, (item) => ({
      ...item,
      isPriority: enabled,
      criteria: enabled ? CriteriaThresholdSchema.parse({}) : null,
    }))
  }
</script>
