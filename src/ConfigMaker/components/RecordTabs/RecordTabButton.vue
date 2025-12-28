<!-- src/configMaker/components/RecordTabs/RecordTabButton.vue -->
<template>
  <button
    class="tab p-1 font-medium duration-200 gap-1 relative overflow-hidden"
    :class="tabClasses"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <!-- 複数選択モード時のチェックボックス -->
    <div v-if="store.isMultiSelectMode" class="pointer-events-none">
      <input type="checkbox" :checked="store.selectedRuleIds.has(rule.key)" class="checkbox checkbox-sm" readonly />
    </div>

    <!-- order 判定する順番 --> 
    <div class="badge badge-sm" :style="{ backgroundColor: rule.editorColor }">
      {{ rule.order != null ? rule.order : 'order:error!' }}
    </div>

    <!-- ルール名（インライン編集対応） -->
    <input
      v-if="isEditing"
      :value="store.editingName"
      @input="store.updateEditingName(($event.target as HTMLInputElement).value)"
      @blur="store.finishInlineEdit"
      @keyup.enter="store.finishInlineEdit"
      @keyup.escape="store.cancelInlineEdit"
      class="bg-transparent border-none outline-none text-current text-center hover:bg-base-200"
      :ref="store.setEditInput"
      @click.stop
    />
    <div v-else class="badge truncate max-w-28" :class="nameWrapperClasses">
      <span class="">
        {{ rule.name || '名称未設定' }}
      </span>
    </div>

    <!-- 状態インジケーター -->
    <div class="flex items-center gap-1 text-xs">
      <span v-if="!getRuleEnabledState" class="opacity-50 text-xs">(無効)</span>
    </div>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RecordCategoryUnion } from '@/types/'
  import { useRecordTabsStore } from './RecordTabsStore'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { useSettingMode } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    rule: RecordCategoryUnion
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { isGod } = useSettingMode()
  const store = useRecordTabsStore()

  // Computed
  const isEditing = computed(() => store.editingRuleId === props.rule.key)
  const isSelected = computed(() => omikujiStore.selectedItemKey === props.rule.key)
  const isMultiSelected = computed(() => store.selectedRuleIds.has(props.rule.key))
  const getRuleEnabledState = computed(() => props.rule.isEnabled !== false)

  const showDragHandle = computed(() => !store.searchQuery && !isEditing.value && !store.isMultiSelectMode)

  const tabClasses = computed(() => ({
    'tab-active bg-primary text-primary-content': isSelected.value,
    'bg-primary/20 border-primary/40 text-primary': isMultiSelected.value,
    'hover:bg-base-200 hover:shadow-md': !isSelected.value && !isMultiSelected.value,
    'opacity-60': !getRuleEnabledState.value,
    'cursor-grab': showDragHandle.value,
    'cursor-pointer': store.isMultiSelectMode,
  }))

  // Event Handlers
  const handleClick = (event: MouseEvent) => {
    if (store.isMultiSelectMode) {
      store.handleMultiSelect(props.rule.key, event)
    } else {
      omikujiStore.selectItem(props.rule.key)
    }
  }

  const nameWrapperClasses = computed(() => {
    if (isGod.value) {
      const baseClasses = ['badge']
      const level = props.rule.accessLevel
      switch (level) {
        case 'basic':
          return [...baseClasses, 'badge-base']
        case 'pro':
          return [...baseClasses, 'badge-secondary']
        case 'internal':
          return [...baseClasses, 'badge-warning']
        case 'experimental':
          return [...baseClasses, 'badge-error']
        default:
          return [...baseClasses, 'badge-primary']
      }
    }
    return []
  })

  // 複数選択モード時のみダブルクリックを無効化する
  const handleDblClick = () => {
    if (!store.isMultiSelectMode) {
      store.startInlineEdit(props.rule)
    }
  }
</script>
