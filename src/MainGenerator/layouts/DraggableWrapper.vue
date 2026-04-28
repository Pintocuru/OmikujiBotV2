<!-- src/MainGenerator/layouts/DraggableWrapper.vue -->
<template>
  <div
    class="relative touch-none"
    :class="unlocked ? 'fixed ' : 'relative'"
    :style="containerStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      ref="targetRef"
      class="touch-none"
      :class="unlocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'"
      :style="style"
      @pointerdown="onDown"
      @dblclick="toggleLock"
    >
      <slot />

      <!-- リサイズハンドル：コンテンツ内右端に重ねる -->
      <div
        v-if="unlocked && resizable"
        class="absolute inset-y-0 right-0 w-3 flex items-center justify-center cursor-ew-resize transition-opacity duration-200"
        :style="{ opacity: showHandle ? 1 : 0, pointerEvents: showHandle ? 'auto' : 'none' }"
        @pointerdown.stop="onResizeStart"
      >
        <!-- グリップドット -->
        <div class="flex flex-col gap-[3px]">
          <span v-for="i in 4" :key="i" class="block w-[3px] h-[3px] rounded-full bg-current opacity-40" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      resizable?: boolean
      minWidth?: number
      maxWidth?: number
      initialWidth?: number
    }>(),
    {
      resizable: false,
      minWidth: 100,
      maxWidth: 800,
      initialWidth: 300,
    }
  )

  const x = ref(0)
  const y = ref(0)
  const width = ref(props.initialWidth)
  const unlocked = ref(true)
  const isHovered = ref(false)
  const isResizing = ref(false)

  const showHandle = computed(() => isHovered.value || isResizing.value)

  let startX = 0
  let startY = 0
  let baseX = 0
  let baseY = 0
  let startWidth = 0
  let startResizeX = 0

  const style = computed(() => ({
    width: unlocked.value && props.resizable ? `${width.value}px` : undefined,
    transform: unlocked.value ? `translate(${x.value}px, ${y.value}px)` : undefined,
    // ハンドル分のパディングを確保
    paddingRight: unlocked.value && props.resizable ? '12px' : undefined,
    position: 'relative' as const,
  }))

  const containerStyle = computed(() => ({
    display: unlocked.value && props.resizable ? 'inline-block' : undefined,
  }))

  const toggleLock = () => {
    unlocked.value = !unlocked.value
    if (unlocked.value) {
      x.value = 0
      y.value = 0
      width.value = props.initialWidth
    }
  }

  const onDown = (e: PointerEvent) => {
    if (!unlocked.value) return
    e.preventDefault()
    e.stopPropagation()

    startX = e.clientX
    startY = e.clientY
    baseX = x.value
    baseY = y.value

    const onMove = (ev: PointerEvent) => {
      x.value = baseX + (ev.clientX - startX)
      y.value = baseY + (ev.clientY - startY)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onResizeStart = (e: PointerEvent) => {
    if (!unlocked.value) return
    e.preventDefault()
    e.stopPropagation()

    isResizing.value = true
    startWidth = width.value
    startResizeX = e.clientX

    const onResizeMove = (ev: PointerEvent) => {
      width.value = Math.min(props.maxWidth, Math.max(props.minWidth, startWidth + (ev.clientX - startResizeX)))
    }
    const onResizeUp = () => {
      isResizing.value = false
      window.removeEventListener('pointermove', onResizeMove)
      window.removeEventListener('pointerup', onResizeUp)
    }
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeUp)
  }
</script>
