<!-- src/ConfigMaker/components/events/OmikujiCard/OmikujiLegendItem.vue -->
<template>
  <div
    class="flex items-center gap-2 text-xs bg-base-100 p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
    :class="{ 'bg-primary text-primary-content': isSelected }"
    @click="$emit('select')"
  >
    <!-- ドラッグハンドル -->
    <div class="legend-drag-handle cursor-move flex-shrink-0">
      <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
    </div>

    <!-- 色インジケーター -->
    <div class="w-4 h-4 rounded flex-shrink-0" :style="{ backgroundColor: color }"></div>

    <!-- 情報 -->
    <div class="flex-1 min-w-0">
      <div class="truncate font-medium">
        {{ item.name || `アイテム` }}
      </div>
      {{ percentage }}%

      <div class="text-base">
        <span v-if="item?.isPriority" class="badge badge-xs badge-primary"> 優先 </span>
        <span v-if="item?.criteria" class="badge badge-xs badge-secondary ml-1"> 条件 </span>
      </div>
    </div>

    <!-- Weight編集 -->
    <div class="text-base" :class="{ 'text-base-content': isSelected }">
      <input
        v-if="!item?.isPriority"
        type="number"
        :value="item.weight"
        @input="handleWeightUpdate"
        @click.stop
        min="0"
        step="1"
        class="input input-xs input-bordered w-16 flex-shrink-0"
      />
    </div>

    <!-- メニュー -->
    <div class="ml-auto">
      <MenuDropdown @duplicate="duplicate" @delete="remove" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { EventCategoryType, OmikujiItemType } from '@/types/OmikujiData/'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { generateId } from '@shared/types'
  import { GripVertical } from 'lucide-vue-next'

  const props = defineProps<{
    category: EventCategoryType
    selectedItemKey: string | null
    item: OmikujiItemType
    color: string
    percentage: string
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    select: []
  }>()

  const handleWeightUpdate = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 0) {
      emit('update:weight', value)
    }
  }

  const { updateRecordProperty } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  const duplicate = () => {
    if (!props.selectedItemKey) return

    const record = getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const index = record.omikuji.findIndex((v) => v.id === props.item.id)
    if (index === -1) return

    const id = generateId()
    const duplicated = {
      ...JSON.parse(JSON.stringify(props.item)),
      id,
      key: id,
      name: `${props.item.name}(コピー)`,
    }

    const newList = [...record.omikuji]
    newList.splice(index + 1, 0, duplicated)

    updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newList)
  }

  const remove = () => {
    if (!props.selectedItemKey) return

    const record = getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newList = record.omikuji.filter((v) => v.id !== props.item.id)

    updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newList)
  }
</script>
