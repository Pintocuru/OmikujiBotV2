<!-- src/ConfigMaker/components/appItems/navigation/SidebarSubItems.vue -->
<template>
  <!-- ── Record カテゴリ（ドラッグ可能） ── -->
  <template v-if="isRecord">
    <VueDraggable
      v-model="localItems"
      :animation="150"
      handle=".drag-handle"
      @end="emit('dragEnd', category as RecordCategoryType)"
    >
      <SidebarSubItem
        v-for="item in localItems"
        :key="item.key"
        :itemKey="item.key"
        :label="item.label"
        :isEnabled="item.isEnabled"
        :isSelected="selectedItemKey === item.key"
        :theme="theme"
        :sections="sections"
        :activeSection="activeSection"
        draggable
        @select="emit('selectItem', item.key, 'baseSettings')"
        @selectSection="(section) => emit('selectSection', section)"
      >
        <template #menu>
          <SidebarItemMenu :item="item.rawItem" :category="category as RecordCategoryType" />
        </template>
      </SidebarSubItem>
    </VueDraggable>
  </template>

  <!-- ── 配列カテゴリ（jsonMerge） ── -->
  <template v-else-if="variant === 'array'">
    <SidebarSubItem
      v-for="item in staticItems"
      :key="item.key"
      :itemKey="item.key"
      :label="item.label"
      :isSelected="selectedItemKey === item.key"
      :theme="theme"
      :sections="sections"
      :activeSection="activeSection"
      @select="emit('selectItem', item.key)"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </template>

  <!-- ── オブジェクトカテゴリ（components / appInfo） ── -->
  <template v-else-if="variant === 'object'">
    <SidebarSubItem
      v-for="item in staticItems"
      :key="item.key"
      :itemKey="item.key"
      :label="item.label"
      :isSelected="selectedItemKey === item.key"
      :theme="theme"
      :sections="sections"
      :activeSection="activeSection"
      @select="emit('selectItem', item.key)"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </template>

  <div v-if="isEmpty" class="pl-8 py-1 text-xs opacity-40">（なし）</div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { CategoryType, RecordCategoryType } from '@/types/OmikujiData/'
  import { BaseRecordType } from '@shared/types'
  import { getSidebarSections, SidebarSectionItem } from './useSidebarSectionMap'
  import SidebarSubItem from './SidebarSubItem.vue'
  import SidebarItemMenu from './SidebarItemMenu.vue'

  export type DraggableSubItem = {
    key: string
    label: string
    isEnabled?: boolean
    rawItem: BaseRecordType
  }

  export type StaticSubItem = {
    key: string
    label: string
  }

  /** サブアイテムリストの表示バリアント */
  export type SubItemsVariant = 'record' | 'array' | 'object'

  const props = defineProps<{
    category: CategoryType
    isRecord: boolean
    /** 'array' = jsonMerge, 'object' = components/appInfo */
    variant?: SubItemsVariant
    modelValue: DraggableSubItem[]
    staticItems: StaticSubItem[]
    selectedItemKey: string
    activeSection: string | null
    theme: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [items: DraggableSubItem[]]
    selectItem: [key: string, section?: string]
    selectSection: [section: string]
    dragEnd: [category: RecordCategoryType]
  }>()

  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const sections = computed<SidebarSectionItem[]>(() => getSidebarSections(props.category))

  const isEmpty = computed(() => (props.isRecord ? props.modelValue.length === 0 : props.staticItems.length === 0))
</script>
