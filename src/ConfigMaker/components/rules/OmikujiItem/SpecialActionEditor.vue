<!-- src\ConfigMaker\components\special\SpecialActionEditor.vue -->
<template>
  <div class="space-y-4">
    <SettingItem label="特殊動作の種類" description="実行する特殊動作を選択してください">
      <select
        :value="special"
        @change="updateSpecial(($event.target as HTMLSelectElement).value as ActionSetSpecialType)"
        class="select select-bordered select-sm w-full"
      >
        <option v-for="(info, key) in specialActionMap" :key="key" :value="key">
          {{ info.label }}
        </option>
      </select>
    </SettingItem>

    <!-- 各特殊動作の説明 -->
    <InformationCard :variant="specialActionMap[special].variant ?? 'info'">
      <p class="font-semibold">{{ specialActionMap[special].label }}</p>
      <p class="text-xs opacity-80">{{ specialActionMap[special].description }}</p>
    </InformationCard>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, ActionSetSpecialType, specialActionMap } from '@/types/OmikujiData/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    index: number
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // Computed
  const omikujiSets = computed(() => {
    if (!props.selectedItemKey) return []
    const record = getItem(props.category, props.selectedItemKey)
    return record?.omikuji || []
  })

  const omikujiItem = computed(() => omikujiSets.value[props.index] || null)
  const special = computed(() => omikujiItem.value?.special || 'return')

  // Update Function
  const updateSpecial = (value: ActionSetSpecialType) => {
    if (props.index === -1 || !props.selectedItemKey) return

    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      special: value,
    }))
  }
</script>
