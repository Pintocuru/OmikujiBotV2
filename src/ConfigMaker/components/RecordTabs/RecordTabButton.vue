<!-- src/ConfigMaker/components/RecordTabs/RecordTabButton.vue -->
<template>
  <button
    class="tab p-1 font-medium duration-200 gap-1 relative overflow-hidden"
    :class="tabClasses"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <!-- 複数選択モード時のチェックボックス -->
    <div v-if="tabsStore.isMultiSelectMode" class="pointer-events-none drag-handle">
      <input type="checkbox" :checked="tabsStore.selectedRuleIds.has(rule.key)" class="checkbox checkbox-sm" readonly />
    </div>

    <!-- order 判定する順番 --> 
    <div class="badge badge-sm" :style="{ backgroundColor: rule.editorColor }">
      {{ rule.order != null ? rule.order : 'order:error!' }}
    </div>

    <!-- イベント名（インライン編集対応） -->
    <input
      v-if="isEditing"
      :value="tabsStore.editingName"
      @input="tabsStore.updateEditingName(($event.target as HTMLInputElement).value)"
      @blur="tabsStore.finishInlineEdit"
      @keyup.enter="tabsStore.finishInlineEdit"
      @keyup.escape="tabsStore.cancelInlineEdit"
      class="bg-base-100 border-none outline-none text-current text-center hover:bg-base-200"
      :ref="tabsStore.setEditInput"
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
  import { useRecordTabsStore } from './RecordTabsStore'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { storeToRefs } from 'pinia'
  import { BaseRecordType } from '@shared/types'

  const props = defineProps<{
    rule: BaseRecordType
  }>()

  // Store
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)
  const { isGod } = useSettingMode()
  const tabsStore = useRecordTabsStore()

  // Computed
  const isEditing = computed(() => tabsStore.editingRuleId === props.rule.key)
  const isSelected = computed(() => selectedItemKey.value === props.rule.key)
  const isMultiSelected = computed(() => tabsStore.selectedRuleIds.has(props.rule.key))
  const getRuleEnabledState = computed(() => props.rule.isEnabled !== false)

  const showDragHandle = computed(() => !tabsStore.searchQuery && !isEditing.value && !tabsStore.isMultiSelectMode)

  const tabClasses = computed(() => ({
    'tab-active bg-primary text-primary-content': isSelected.value,
    'bg-primary/20 border-primary/40 text-primary': isMultiSelected.value,
    'hover:bg-base-200 hover:shadow-md': !isSelected.value && !isMultiSelected.value,
    'opacity-60': !getRuleEnabledState.value,
    'cursor-grab': showDragHandle.value,
    'cursor-pointer': tabsStore.isMultiSelectMode,
  }))

  // Event Handlers
  const handleClick = (event: MouseEvent) => {
    if (tabsStore.isMultiSelectMode) {
      tabsStore.handleMultiSelect(props.rule.key, event)
    } else {
      navigationStore.selectItem(props.rule.key)
    }
  }

  const nameWrapperClasses = computed(() => {
    if (isGod.value) {
      const baseClasses = ['badge']
      const level = props.rule.accessLevel
      switch (level) {
        case 'basic':
          return [...baseClasses, 'badge-base']
        case 'adv':
          return [...baseClasses, 'badge-info']
        case 'pro':
          return [...baseClasses, 'badge-secondary']
        case 'godMode':
          return [...baseClasses, 'badge-warning']
        case 'none':
          return [...baseClasses, 'badge-error']
        default:
          return [...baseClasses, 'badge-primary']
      }
    }
    return []
  })

  // 複数選択モード時のみダブルクリックを無効化する
  const handleDblClick = () => {
    if (!tabsStore.isMultiSelectMode) {
      tabsStore.startInlineEdit(props.rule)
    }
  }
</script>
