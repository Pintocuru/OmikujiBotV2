<!-- src/MainGenerator/ui/GiftRanking/layouts/scroll.vue -->
<template>
  <div class="p-2 w-full overflow-hidden">
    <div
      ref="trackRef"
      class="flex gap-3"
      :class="shouldScroll ? 'auto-scroll' : 'w-max'"
      :style="shouldScroll ? scrollStyle : {}"
    >
      <!-- オリジナル -->
      <ScrollItem
        v-for="(message, index) in messages"
        :key="message.id"
        :message="message"
        :index="index"
        :icon-size="iconSize"
        :show="show"
      />
      <!-- ループ用コピー（スクロール時のみ） -->
      <template v-if="shouldScroll">
        <ScrollItem
          v-for="(message, index) in messages"
          :key="`clone-${message.id}`"
          :message="message"
          :index="index"
          :icon-size="iconSize"
          :show="show"
          aria-hidden="true"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import ScrollItem from './ScrollItem.vue'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)

  const trackRef = ref<HTMLElement | null>(null)
  const trackWidth = ref(0)
  const containerWidth = ref(0)

  // アイテム1セット分の幅を計測
  const measureWidths = async () => {
    await nextTick()
    if (!trackRef.value) return
    containerWidth.value = trackRef.value.parentElement?.clientWidth ?? 0
    // オリジナル半分（クローン除く）の幅
    const items = trackRef.value.querySelectorAll<HTMLElement>(':scope > *:not([aria-hidden])')
    let w = 0
    items.forEach((el) => {
      w += el.offsetWidth + 12
    }) // 12 = gap-3
    trackWidth.value = w
  }

  const shouldScroll = computed(() => trackWidth.value > containerWidth.value || props.messages.length > 3)

  // CSS animation duration: 速さは 80px/s 固定
  const scrollStyle = computed(() => ({
    '--scroll-width': `${trackWidth.value}px`,
    animationDuration: `${Math.max(trackWidth.value / 20, 4)}s`,
  }))

  let ro: ResizeObserver | null = null

  onMounted(() => {
    ro = new ResizeObserver(measureWidths)
    if (trackRef.value?.parentElement) {
      ro.observe(trackRef.value.parentElement)
    }
    measureWidths()
  })

  onUnmounted(() => ro?.disconnect())
</script>

<style scoped>
  @keyframes scroll-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-1 * var(--scroll-width) - 12px));
    }
  }

  .auto-scroll {
    display: flex;
    width: max-content;
    animation: scroll-left linear infinite;
    animation-duration: inherit;
  }
</style>
