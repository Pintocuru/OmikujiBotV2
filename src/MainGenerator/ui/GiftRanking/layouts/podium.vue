<!-- src/MainGenerator/ui/GiftRanking/layouts/podium.vue -->
<template>
  <div class="p-3 w-full">
    <!-- 表彰台（1〜3位）: 2位・1位・3位の順に並べて高さで差をつける -->
    <div class="flex items-end justify-center gap-3 mb-3">
      <PodiumItem v-if="messages[1]" :message="messages[1]" :index="1" :show="show" :icon-size="iconSize" />
      <PodiumItem v-if="messages[0]" :message="messages[0]" :index="0" :show="show" :icon-size="iconSize" />
      <PodiumItem v-if="messages[2]" :message="messages[2]" :index="2" :show="show" :icon-size="iconSize" />
    </div>

    <!-- 4位以降：ScrollItem を使った自動スクロール -->
    <div v-if="messages.length > 3" class="overflow-hidden">
      <div
        ref="trackRef"
        class="flex gap-3"
        :class="shouldScroll ? 'auto-scroll' : 'w-max'"
        :style="shouldScroll ? scrollStyle : {}"
      >
        <ScrollItem
          v-for="(message, index) in rest"
          :key="message.id"
          :message="message"
          :index="index + 3"
          :icon-size="iconSize"
          :show="show"
        />
        <template v-if="shouldScroll">
          <ScrollItem
            v-for="(message, index) in rest"
            :key="`clone-${message.id}`"
            :message="message"
            :index="index + 3"
            :icon-size="iconSize"
            :show="show"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import PodiumItem from './PodiumItem.vue'
  import ScrollItem from './ScrollItem.vue'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)

  const rest = computed(() => props.messages.slice(3))

  const trackRef = ref<HTMLElement | null>(null)
  const trackWidth = ref(0)
  const containerWidth = ref(0)

  const measureWidths = async () => {
    await nextTick()
    if (!trackRef.value) return
    containerWidth.value = trackRef.value.parentElement?.clientWidth ?? 0
    const items = trackRef.value.querySelectorAll<HTMLElement>(':scope > *:not([aria-hidden])')
    let w = 0
    items.forEach((el) => {
      w += el.offsetWidth + 12
    })
    trackWidth.value = w
  }

  const shouldScroll = computed(() => trackWidth.value > containerWidth.value)

  const scrollStyle = computed(() => ({
    '--scroll-width': `${trackWidth.value}px`,
    animationDuration: `${Math.max(trackWidth.value / 20, 4)}s`,
  }))

  let ro: ResizeObserver | null = null

  onMounted(() => {
    ro = new ResizeObserver(measureWidths)
    if (trackRef.value?.parentElement) ro.observe(trackRef.value.parentElement)
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
  }
</style>
