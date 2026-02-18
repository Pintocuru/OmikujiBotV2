<!-- vue-draggable-plus の代替品 -->
<template>
  <component
    :is="tag"
    ref="containerRef"
    :class="classes"
    :data-drag-group="group"
    @dragover.prevent="handleContainerDragOver"
    @drop="handleDropOnContainer"
    @dragleave="handleDragLeave"
  >
    <div
      v-for="(item, index) in internalValue"
      :key="getItemKey(item, index)"
      :data-index="index"
      class="draggable-item"
      :draggable="!disabled"
      @dragstart="handleDragStart($event, index, item)"
      @dragend="handleDragEnd"
      @dragenter.prevent="handleDragEnter($event, index)"
      @dragover.prevent
      @drop.stop="handleDrop($event, index)"
    >
      <slot name="item" :element="item" :index="index"></slot>
    </div>
    <slot name="footer"></slot>
  </component>
</template>

<script setup lang="ts">
  import { ref, computed, watch, getCurrentInstance } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: any[]
      itemKey: string
      tag?: string
      classes?: string | string[] | Record<string, boolean>
      group?: string
      disabled?: boolean
      animation?: number
    }>(),
    {
      tag: 'div',
      disabled: false,
      animation: 150,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: any[]]
    start: []
    end: []
  }>()

  const instance = getCurrentInstance()
  const containerRef = ref<HTMLElement | null>(null)
  const dragOverIndex = ref<number | null>(null)

  // グローバルドラッグ状態（windowオブジェクトに保存して確実に共有）
  if (typeof window !== 'undefined') {
    ;(window as any).__dragState = (window as any).__dragState || {
      group: null,
      sourceIndex: null,
      item: null,
      sourceEmit: null,
      sourceValue: null,
    }
  }

  const getDragState = () => (window as any).__dragState
  const setDragState = (state: any) => {
    ;(window as any).__dragState = state
  }

  const internalValue = computed(() => props.modelValue || [])

  const getItemKey = (item: any, index: number): string | number => {
    if (!item) return index
    if (props.itemKey && item[props.itemKey] !== undefined) {
      return item[props.itemKey]
    }
    return item.id ?? item.key ?? index
  }

  // ドラッグ開始
  const handleDragStart = (event: DragEvent, index: number, item: any) => {
    if (props.disabled) return

    setDragState({
      group: props.group,
      sourceIndex: index,
      item: item,
      sourceEmit: emit,
      sourceValue: props.modelValue,
      sourceInstance: instance?.uid,
    })

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
    }

    const target = event.currentTarget as HTMLElement
    setTimeout(() => {
      target.style.opacity = '0.4'
    }, 0)

    emit('start')
  }

  // ドラッグ終了
  const handleDragEnd = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    target.style.opacity = '1'

    // スタイルをクリア
    document.querySelectorAll('.draggable-item').forEach((el) => {
      ;(el as HTMLElement).style.borderLeft = ''
      ;(el as HTMLElement).style.backgroundColor = ''
    })

    dragOverIndex.value = null

    // 少し遅延させてからクリア
    setTimeout(() => {
      setDragState({
        group: null,
        sourceIndex: null,
        item: null,
        sourceEmit: null,
        sourceValue: null,
        sourceInstance: null,
      })
    }, 100)

    emit('end')
  }

  // ドラッグエンター
  const handleDragEnter = (event: DragEvent, index: number) => {
    if (props.disabled) return

    const state = getDragState()

    // グループチェック
    if (state.group && props.group && state.group !== props.group) {
      return
    }

    dragOverIndex.value = index

    // ビジュアルフィードバック
    document.querySelectorAll('.draggable-item').forEach((el) => {
      ;(el as HTMLElement).style.borderLeft = ''
    })

    const target = event.currentTarget as HTMLElement
    target.style.borderLeft = '3px solid #3b82f6'
  }

  // コンテナへのドラッグオーバー
  const handleContainerDragOver = (event: DragEvent) => {
    if (props.disabled) return

    const state = getDragState()
    if (!state.item) return

    // グループチェック
    if (state.group && props.group && state.group !== props.group) {
      event.dataTransfer!.dropEffect = 'none'
      return
    }

    event.dataTransfer!.dropEffect = 'move'
  }

  // ドラッグリーブ
  const handleDragLeave = (event: DragEvent) => {
    const target = event.target as HTMLElement
    if (target === containerRef.value) {
      dragOverIndex.value = null
    }
  }

  // アイテム上にドロップ
  const handleDrop = (event: DragEvent, dropIndex: number) => {
    if (props.disabled) return

    event.preventDefault()
    event.stopPropagation()

    const state = getDragState()

    // グループチェック
    if (state.group && props.group && state.group !== props.group) {
      return
    }

    if (!state.item || state.sourceIndex === null) return

    const isSameList = state.sourceValue === props.modelValue

    if (isSameList) {
      // 同じリスト内での移動
      if (state.sourceIndex === dropIndex) return

      const newList = [...internalValue.value]
      const [movedItem] = newList.splice(state.sourceIndex, 1)
      newList.splice(dropIndex, 0, movedItem)

      emit('update:modelValue', newList)
    } else {
      // 異なるリスト間での移動
      // ソースから削除
      const sourceList = [...state.sourceValue]
      sourceList.splice(state.sourceIndex, 1)
      state.sourceEmit('update:modelValue', sourceList)

      // ターゲットに追加
      const targetList = [...internalValue.value]
      targetList.splice(dropIndex, 0, state.item)
      emit('update:modelValue', targetList)
    }

    // スタイルをクリア
    const target = event.currentTarget as HTMLElement
    target.style.borderLeft = ''
  }

  // コンテナ上にドロップ（末尾に追加）
  const handleDropOnContainer = (event: DragEvent) => {
    if (props.disabled) return

    // アイテム上でのドロップは除外
    if ((event.target as HTMLElement).closest('.draggable-item')) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const state = getDragState()

    // グループチェック
    if (state.group && props.group && state.group !== props.group) {
      return
    }

    if (!state.item || state.sourceIndex === null) return

    const isSameList = state.sourceValue === props.modelValue

    if (!isSameList) {
      // 異なるリストから末尾に追加
      const sourceList = [...state.sourceValue]
      sourceList.splice(state.sourceIndex, 1)
      state.sourceEmit('update:modelValue', sourceList)

      const targetList = [...internalValue.value, state.item]
      emit('update:modelValue', targetList)
    }
  }

  watch(
    () => props.disabled,
    (newVal) => {
      if (newVal) {
        const state = getDragState()
        if (state.sourceValue === props.modelValue) {
          setDragState({
            group: null,
            sourceIndex: null,
            item: null,
            sourceEmit: null,
            sourceValue: null,
          })
        }
      }
    }
  )
</script>

<style scoped>
  .draggable-item {
    transition:
      opacity 0.15s ease,
      border-left 0.15s ease,
      background-color 0.15s ease;
    position: relative;
  }

  .draggable-item:not([draggable='false']) {
    cursor: grab;
  }

  .draggable-item:not([draggable='false']):active {
    cursor: grabbing;
  }
</style>
