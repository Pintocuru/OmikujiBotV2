<!-- src\ConfigMaker\components\rules\OmikujiItemIsPriority.vue -->
<template>
  <div class="space-y-4">
    <!-- 追加発動条件の有効化 -->
    <div class="form-control">
      <SettingItem label="追加発動条件を設定する" description="条件を満たした場合の優先度を設定できます">
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
    </div>

    <div class="flex items-center gap-4">
      <!-- 優先度（criteriaがある場合のみ表示） -->
      <div v-if="hasCriteria" class="form-control flex-1">
        <SettingItem label="優先度" description="追加条件達成時、優先で選ばれます">
          <label class="label cursor-pointer gap-2">
            <input
              type="checkbox"
              class="toggle toggle-primary"
              :checked="omikuji.isPriority"
              @change="updatePriority(($event.target as HTMLInputElement).checked)"
            />
            <span class="label-text">優先度を上げる</span>
          </label>
        </SettingItem>
      </div>

      <!-- 重み -->
      <OmikujiItemWeight
        :all-omikuji="allOmikuji"
        :omikuji="omikuji"
        :category="category"
        :index="index"
        :selected-item-key="selectedItemKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import OmikujiItemWeight from './OmikujiItemWeight.vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { CriteriaThresholdSchema } from '@/types/OmikujiProcess/CriteriaThresholdSchema'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // criteriaが設定されているか
  const hasCriteria = computed(() => props.omikuji.criteria !== null)

  // 優先度更新
  const updatePriority = (value: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: value,
    }))
  }

  // criteriaのトグル
  const toggleCriteria = (enabled: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: enabled,
      criteria: enabled ? CriteriaThresholdSchema.parse({}) : null,
    }))
  }
</script>
