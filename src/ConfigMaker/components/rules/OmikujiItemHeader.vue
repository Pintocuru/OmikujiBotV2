<!-- src\ConfigMaker\components\rules\OmikujiItemHeader.vue -->
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

    <!-- 重み(コメントルール以外での表示) -->
    <div v-if="category !== 'comments'" class="form-control flex-1">
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
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { GripVertical } from 'lucide-vue-next'
  import { computed } from 'vue'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // 名前更新
  const updateName = (value: string) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      name: value,
    }))
  }

  // 全体の重みの合計を計算
  const totalWeight = computed(() => {
    return props.allOmikuji.reduce((sum, item) => sum + (item.weight || 0), 0)
  })

  // 現在のおみくじの出現率を計算
  const weightPercentage = computed(() => {
    if (totalWeight.value === 0) return '0.00'
    return ((props.omikuji.weight / totalWeight.value) * 100).toFixed(2)
  })

  // 重み更新
  const updateWeight = (value: number) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      weight: value,
    }))
  }

  const duplicateOmikuji = () => {
    if (index.value === -1 || !props.selectedItemKey) return
    const id = crypto.randomUUID()
    const duplicated = {
      ...JSON.parse(JSON.stringify(props.omikuji)),
      id,
      key: id,
      name: `${props.omikuji.name}(コピー)`,
    }

    // 配列全体を更新
    const record = omikujiStore.getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(index.value + 1, 0, duplicated)
    omikujiStore.updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }

  const removeOmikuji = () => {
    if (index.value === -1 || !props.selectedItemKey) return

    const record = omikujiStore.getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(index.value, 1)
    omikujiStore.updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }
</script>
