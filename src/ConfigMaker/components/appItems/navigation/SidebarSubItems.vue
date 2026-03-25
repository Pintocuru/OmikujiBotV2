<template>
  <!-- Record カテゴリ（ドラッグ可能） -->
  <div v-if="isRecord">
    <VueDraggable
      v-model="localItems"
      :animation="150"
      handle=".drag-handle"
      :disabled="!isDragDisabled"
      @start="emit('dragStart')"
      @end="emit('dragEnd', category as RecordCategoryType)"
    >
      <SidebarSubItem
        v-for="item in localItems.filter((i) => i?.key)"
        :key="item.key"
        :itemKey="item.key"
        :label="item.label ?? ''"
        :isEnabled="item.isEnabled"
        :isSelected="selectedItemKey === item.key"
        :theme="theme"
        :sections="staticSections"
        :activeSection="activeSection"
        :isDragDisabled="!isDragDisabled"
        draggable
        @select="emit('selectItem', item.key, 'baseSettings')"
        @selectSection="(section) => emit('selectSection', section)"
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

  <!-- components: 有効コンポーネントをセクションとして表示 -->
  <div v-else-if="category === 'components'">
    <SidebarSectionList
      :sections="componentsSections"
      :activeSection="activeSection"
      :theme="theme"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </div>

  <!-- jsonMerge: 静的配列アイテム -->
  <div v-else-if="variant === 'array'">
    <SidebarSubItem
      v-for="item in staticItems"
      :key="item.key"
      :itemKey="item.key"
      :label="item.label"
      :isSelected="selectedItemKey === item.key"
      :theme="theme"
      :sections="[]"
      :activeSection="activeSection"
      :isDragDisabled="isDragDisabled"
      draggable
      @select="emit('selectItem', item.key)"
      @selectSection="(section) => emit('selectSection', section)"
      @item-dblclick="handleItemDblclick"
    />
  </div>

  <!-- appInfo: 静的セクションリスト -->
  <div v-else-if="variant === 'object'">
    <SidebarSectionList
      :sections="staticSections"
      :activeSection="activeSection"
      :theme="theme"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </div>

  <div v-if="isEmpty" class="pl-8 py-1 text-xs opacity-40">（なし）</div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
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
    isDragging: boolean
    isDragDisabled: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [items: DraggableSubItem[]]
    'update:isDragDisabled': [isDragDisabled: boolean]
    selectItem: [key: string, section?: string]
    selectSection: [section: string]
    dragStart: []
    dragEnd: [category: RecordCategoryType]
  }>()

  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const staticSections = computed<SidebarSectionItem[]>(() =>
    props.category === 'components' ? [] : getSidebarSections(props.category as Exclude<CategoryType, 'components'>)
  )

  const componentsSections = useComponentsSections()

  const isEmpty = computed(() => {
    if (props.category === 'components') return componentsSections.value.length === 0
    if (props.category === 'appInfo') return staticSections.value.length === 0
    return props.isRecord ? props.modelValue.length === 0 : props.staticItems.length === 0
  })

  const activeMenuKey = ref<string | null>(null)

  const handleItemDblclick = (key: string) => {
    const closing = activeMenuKey.value === key
    activeMenuKey.value = closing ? null : key
    emit('update:isDragDisabled', !closing)
  }
</script>
