<!-- src/configMaker/components/comments/OmikujiSetBasic.vue -->
<template>
  <div class="flex items-center gap-4">
    <!-- ドラッグハンドル -->
    <div class="drag-handle cursor-move text-base-content/50 hover:text-base-content">
      <GripVertical class="w-5 h-5" />
    </div>

    <!-- 名前 -->
    <div class="form-control flex-1">
      <SettingItem label="おみくじ名" description="識別しやすい名前を入力">
        <input
          type="text"
          :value="omikuji.name"
          @input="updateName(($event.target as HTMLInputElement).value)"
          placeholder="おみくじ名"
          class="input input-bordered input-sm w-full"
        />
      </SettingItem>
    </div>

    <!-- 重み -->
    <div class="form-control flex-1">
      <SettingItem :label="`重み (${weightPercentage}%)`" description="数値が高いほど出やすくなります">
        <input
          type="number"
          :value="omikuji.weight"
          @input="updateWeight(parseFloat(($event.target as HTMLInputElement).value))"
          min="0"
          class="input input-bordered input-sm w-full"
        />
      </SettingItem>
    </div>

    <!-- メニュー -->
    <div class="ml-auto">
      <MenuDropdown @duplicate="duplicateOmikuji" @delete="removeOmikuji" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { GripVertical } from 'lucide-vue-next'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  // Pinia ストアを使用
  const omikujiStore = useOmikujiStore()

  // 全体の重みの合計を計算
  const totalWeight = computed(() => {
    return props.allOmikuji.reduce((sum, item) => sum + (item.weight || 0), 0)
  })

  // 現在のおみくじの出現率を計算
  const weightPercentage = computed(() => {
    if (totalWeight.value === 0) return '0.00'
    return ((props.omikuji.weight / totalWeight.value) * 100).toFixed(2)
  })

  // 共通の更新関数
  const updateOmikujiSets = (updateFn: (sets: OmikujiItemType[], index: number) => OmikujiItemType[]) => {
    if (!props.selectedItemKey) return
    const index = props.allOmikuji.findIndex((item) => item.id === props.omikuji.id)
    if (index === -1) return
    omikujiStore.updateRecordProperty(
      props.category,
      props.selectedItemKey,
      'omikuji',
      updateFn([...props.allOmikuji], index)
    )
  }

  const updateName = (value: string) =>
    updateOmikujiSets((sets, index) => {
      sets[index] = { ...sets[index], name: value }
      return sets
    })

  const updateWeight = (value: number) =>
    updateOmikujiSets((sets, index) => {
      sets[index] = { ...sets[index], weight: value }
      return sets
    })

  const duplicateOmikuji = () =>
    updateOmikujiSets((sets, index) => {
      const duplicated = {
        ...JSON.parse(JSON.stringify(props.omikuji)),
        id: crypto.randomUUID(),
        name: `${props.omikuji.name} (コピー)`,
      }
      sets.splice(index + 1, 0, duplicated)
      return sets
    })

  const removeOmikuji = () => {
    updateOmikujiSets((sets, index) => {
      sets.splice(index, 1)
      return sets
    })
  }
</script>
