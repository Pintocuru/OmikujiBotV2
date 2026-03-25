<!-- src/ConfigMaker/components/appItems/SidebarSubItems.vue -->
<template>
  <template v-if="isRecord">
    <VueDraggable
      v-model="localItems"
      :animation="150"
      handle=".drag-handle"
      @end="emit('dragEnd', category as RecordCategoryType)"
    >
      <div
        v-for="item in localItems"
        :key="item.key"
        class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-base-300 cursor-pointer"
        :class="selectedItemKey === item.key ? `bg-${theme} text-${theme}-content` : ''"
        @click="emit('selectItem', item.key, 'baseSettings')"
      >
        <GripVertical class="drag-handle w-3 h-3 shrink-0 opacity-0 group-hover:opacity-30 cursor-grab" />
        <EyeOff v-if="item.isEnabled === false" class="w-3 h-3 shrink-0 opacity-40" />
        <span
          class="text-xs py-1 truncate flex-1 min-w-0"
          :class="[selectedItemKey !== item.key ? 'opacity-70' : '', item.isEnabled === false ? 'line-through' : '']"
        >
          {{ item.label }}
        </span>
        <SidebarItemMenu :item="item.rawItem" :category="category as RecordCategoryType" />
      </div>
    </VueDraggable>
  </template>

  <template v-else>
    <div
      v-for="item in staticItems"
      :key="item.key"
      class="group flex items-center gap-1 pl-6 pr-1 rounded hover:bg-base-300 cursor-pointer"
      :class="selectedItemKey === item.key ? `bg-${theme} text-${theme}-content` : ''"
      @click="emit('selectItem', item.key)"
    >
      <span class="text-xs py-1 truncate flex-1 min-w-0" :class="selectedItemKey !== item.key ? 'opacity-70' : ''">
        {{ item.label }}
      </span>
    </div>
  </template>

  <div v-if="isEmpty" class="pl-8 py-1 text-xs opacity-40">（なし）</div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { GripVertical, EyeOff } from 'lucide-vue-next'
  import { CategoryType, RecordCategoryType } from '@/types/OmikujiData/'
  import { BaseRecordType } from '@shared/types'
  import SidebarItemMenu from './SidebarItemMenu.vue'

  type DraggableSubItem = {
    key: string
    label: string
    isEnabled?: boolean
    rawItem: BaseRecordType
  }

  type StaticSubItem = {
    key: string
    label: string
  }

  const props = defineProps<{
    category: CategoryType
    isRecord: boolean
    modelValue: DraggableSubItem[] // draggableItems[key] のバインド用
    staticItems: StaticSubItem[]
    selectedItemKey: string
    theme: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [items: DraggableSubItem[]]
    selectItem: [key: string, section?: 'baseSettings']
    dragEnd: [category: RecordCategoryType]
  }>()

  // VueDraggable の v-model を props 経由で扱う
  const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const isEmpty = computed(() => (props.isRecord ? props.modelValue.length === 0 : props.staticItems.length === 0))
</script>
