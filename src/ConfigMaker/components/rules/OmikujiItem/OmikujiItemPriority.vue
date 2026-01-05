<!-- src\ConfigMaker\components\rules\OmikujiItemPriority.vue -->
<template>
  <template v-if="omikuji">
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
    <div v-if="hasCriteria" class="card p-4 space-y-2 bg-base-200 rounded-lg shadow-lg">
      <SubSectionHeader
        icon="Filter"
        variant="primary"
        title="追加条件"
        description="このおみくじが適用される追加の条件を設定します"
      />
      <SettingItem label="優先度" description="追加条件達成時、優先で選ばれます">
        <label class="label cursor-pointer gap-2">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="omikuji.isPriority"
            @change="updatePriority(($event.target as HTMLInputElement).checked)"
          />
          <span class="label-text">
            {{ omikuji.isPriority ? '適用時、このおみくじが必ず適用されます' : '他のおみくじと同じ抽選を行います' }}
          </span>
        </label>
      </SettingItem>

      <!-- 発動条件 -->
      <OmikujiItemCriteria
        :allOmikuji="allOmikuji"
        :omikuji="omikuji"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import OmikujiItemCriteria from './OmikujiItemCriteria.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { CriteriaThresholdSchema } from '@/types/OmikujiProcess/CriteriaThresholdSchema'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()

  const index = computed(() => {
    if (!props.omikuji) return -1
    return props.allOmikuji.findIndex((item) => item.key === props.omikuji?.key)
  })
  // criteriaが設定されているか
  const hasCriteria = computed(() => props.omikuji?.criteria !== null)

  // 優先度更新
  const updatePriority = (value: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: value,
    }))
  }

  // criteriaのトグル
  const toggleCriteria = (enabled: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: enabled,
      criteria: enabled ? CriteriaThresholdSchema.parse({}) : null,
    }))
  }
</script>
