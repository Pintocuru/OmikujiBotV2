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
        :sections="staticSections"
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

  <!-- ── components（動的セクション / サブアイテムなし） ── -->
  <template v-else-if="category === 'components'">
    <SidebarSectionList
      :sections="componentsSections"
      :activeSection="activeSection"
      :theme="theme"
      @selectSection="(section) => emit('selectSection', section)"
    />
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
      :sections="[]"
      :activeSection="activeSection"
      @select="emit('selectItem', item.key)"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </template>

  <!-- ── オブジェクトカテゴリ（appInfo） ── -->
  <template v-else-if="variant === 'object'">
    <SidebarSectionList
      :sections="staticSections"
      :activeSection="activeSection"
      :theme="theme"
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
  import { getSidebarSections, useComponentsSections } from './useSidebarSectionMap'
  import SidebarSubItem from './SidebarSubItem.vue'
  import SidebarSectionList from './SidebarSectionList.vue'
  import SidebarItemMenu from './SidebarItemMenu.vue'
  import { SidebarSectionItem } from './StaticSectionMap'

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

  export type SubItemsVariant = 'record' | 'array' | 'object'

  const props = defineProps<{
    category: CategoryType
    isRecord: boolean
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

  // 静的セクション（components 以外）
  const staticSections = computed<SidebarSectionItem[]>(() =>
    props.category === 'components' ? [] : getSidebarSections(props.category as Exclude<CategoryType, 'components'>)
  )

  // components 専用: 動的セクション
  const componentsSections = useComponentsSections()

  const isEmpty = computed(() => {
    if (props.category === 'components') return componentsSections.value.length === 0
    if (props.category === 'appInfo') return staticSections.value.length === 0
    return props.isRecord ? props.modelValue.length === 0 : props.staticItems.length === 0
  })
</script>
