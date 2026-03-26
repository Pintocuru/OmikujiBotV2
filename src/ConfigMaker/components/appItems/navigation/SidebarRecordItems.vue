<!-- src/ConfigMaker/components/appItems/navigation/SidebarRecordItems.vue -->
<template>
  <div>
    <VueDraggable
      v-model="localItems"
      :animation="150"
      handle=".drag-handle"
      :disabled="!isDragEnabled"
      @end="emit('dragEnd', category as RecordCategoryType)"
    >
      <SidebarSubItem
        v-for="item in localItems.filter((i) => i?.key)"
        :key="item.key"
        :category="category"
        :itemKey="item.key"
        :label="item.label ?? ''"
        :isEnabled="item.isEnabled"
        :isDragEnabled="isDragEnabled"
        :isSelected="selectedItemKey === item.key"
        :sections="getSidebarSections(category as Exclude<CategoryType, 'components'>)"
        draggable
        @select="navigationStore.selectItem(item.key, 'baseSettings')"
        @item-dblclick="handleItemDblclick"
      >
        <template v-if="item.rawItem" #menu>
          <div @dblclick.stop>
            <SidebarItemMenu :item="item.rawItem" :category="category as RecordCategoryType" />
          </div>
        </template>
      </SidebarSubItem>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { VueDraggable } from 'vue-draggable-plus'
  import { CategoryType, RecordCategoryType } from '@/types/OmikujiData/'
  import { BaseRecordType } from '@shared/types'
  import { getSidebarSections } from './useSidebarSectionMap'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import SidebarSubItem from './SidebarSubItem.vue'
  import SidebarItemMenu from './SidebarItemMenu.vue'

  export type DraggableSubItem = {
    key: string
    label: string
    isEnabled?: boolean
    rawItem: BaseRecordType
  }

  const props = defineProps<{
    category: CategoryType
    modelValue: DraggableSubItem[]
    isDragEnabled: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [items: DraggableSubItem[]]
    'update:isDragEnabled': [val: boolean]
    dragEnd: [category: RecordCategoryType]
  }>()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const activeMenuKey = ref<string | null>(null)
  const handleItemDblclick = (key: string) => {
    const closing = activeMenuKey.value === key
    activeMenuKey.value = closing ? null : key
    emit('update:isDragEnabled', !closing)
  }
</script>
