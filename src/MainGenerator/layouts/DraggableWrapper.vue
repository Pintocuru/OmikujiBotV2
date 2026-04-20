<!-- components/DraggableWrapper.vue -->
<template>
  <div :class="unlocked ? 'fixed z-50' : 'relative'" :style="style" @pointerdown="onDown" @dblclick="toggleLock">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const x = ref(0)
  const y = ref(0)
  const unlocked = ref(false)

  let startX = 0
  let startY = 0
  let baseX = 0
  let baseY = 0

  const style = computed(() => ({
    transform: unlocked.value ? `translate(${x.value}px, ${y.value}px)` : undefined,
    touchAction: 'none',
    cursor: unlocked.value ? 'grab' : 'default',
  }))

  const toggleLock = () => {
    unlocked.value = !unlocked.value
  }

  const onDown = (e: PointerEvent) => {
    if (!unlocked.value) return

    e.preventDefault()

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
</script>
