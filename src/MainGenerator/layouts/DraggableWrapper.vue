<!-- components/DraggableWrapper.vue -->
<template>
  <div class="relative touch-none" :class="unlocked ? 'fixed z-50' : 'relative'" :style="containerStyle">
    <div
      ref="targetRef"
      class="touch-none"
      :class="unlocked ? 'cursor-grab' : 'cursor-default'"
      :style="style"
      @pointerdown="onDown"
      @dblclick="toggleLock"
    >
      <slot />
    </div>

    <!-- リサイズハンドル -->
    <div
      v-if="unlocked && resizable"
      class="absolute top-0 right-[-6px] w-[6px] h-full cursor-ew-resize rounded-full transition-all duration-300"
      :class="showHandle ? 'bg-gray-400/50' : 'bg-transparent'"
      @pointerdown.stop="onResizeStart"
      @mouseenter="handleMouseEnter"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue'

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
  const unlocked = ref(false)
  const showHandle = ref(true)

  let hideTimer: ReturnType<typeof setTimeout> | null = null
  let startX = 0
  let startY = 0
  let baseX = 0
  let baseY = 0
  let startWidth = 0
  let startResizeX = 0

  const style = computed(() => ({
    width: unlocked.value && props.resizable ? `${width.value}px` : undefined,
    transform: unlocked.value ? `translate(${x.value}px, ${y.value}px)` : undefined,
  }))

  const containerStyle = computed(() => ({
    display: unlocked.value && props.resizable ? 'inline-block' : undefined,
  }))

  const startHideTimer = () => {
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      showHandle.value = false
    }, 2000)
  }

  const showHandleTemporarily = () => {
    showHandle.value = true
    startHideTimer()
  }

  const handleMouseEnter = () => {
    if (hideTimer) clearTimeout(hideTimer)
    showHandle.value = true
  }

  const toggleLock = () => {
    unlocked.value = !unlocked.value
    if (unlocked.value) {
      showHandleTemporarily()
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

    startWidth = width.value
    startResizeX = e.clientX

    const onResizeMove = (ev: PointerEvent) => {
      const deltaX = ev.clientX - startResizeX
      let newWidth = startWidth + deltaX
      newWidth = Math.min(props.maxWidth, Math.max(props.minWidth, newWidth))
      width.value = newWidth
    }

    const onResizeUp = () => {
      window.removeEventListener('pointermove', onResizeMove)
      window.removeEventListener('pointerup', onResizeUp)
    }

    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeUp)
  }

  // アンロック時にハンドルを表示
  onUnmounted(() => {
    if (hideTimer) clearTimeout(hideTimer)
  })
</script>
