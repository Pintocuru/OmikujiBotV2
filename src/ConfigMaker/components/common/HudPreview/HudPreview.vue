<!-- src/ConfigMaker/components/common/HudPreview/HudPreview.vue -->
<template>
  <div :class="[heightClass, 'overflow-hidden relative']">
    <div :style="bgStyle" class="w-full h-full">
      <!-- スケーリング可能なコンテンツ（メインスロット） -->
      <div :style="contentStyle" class="origin-top-left">
        <slot />
      </div>

      <!-- 右下に配置するHUD用のスロット -->
      <div class="absolute bottom-2 right-2 z-10 space-y-1">
        <slot name="hud" />
      </div>

      <!-- 右下に配置するHUD用のスロット -->
      <div class="absolute bottom-2 left-2 z-10 space-y-2">
        <!-- スケール値表示 -->
        <slot name="hudLeft" />
        <div class="flex gap-2">
          <!-- Scale -->
          <div class="text-xs text-white bg-black/50 px-1 rounded">{{ Math.round(scale * 100) }}%</div>
          <input type="range" min="0.2" max="1" step="0.1" v-model="scale" class="range range-xs w-12" />
        </div>
      </div>

      <template v-if="(isAdminOnly && isDev) || !isAdminOnly">
        <!-- Lucide Icons -->
        <div
          class="absolute top-2 right-2 flex gap-1 transition-opacity duration-300"
          :class="showTools ? 'opacity-100' : 'opacity-0'"
          @mouseenter="showTemporarily"
          @mousemove="showTemporarily"
          @mouseleave="showTemporarily"
        >
          <component
            :is="Sun"
            :size="24"
            class="cursor-pointer hover:text-gray-300 transition-colors"
            @click="lightness = Math.min(lightness + 10, 100)"
          />
          <component
            :is="Moon"
            :size="24"
            class="cursor-pointer hover:text-gray-300 transition-colors"
            @click="lightness = Math.max(lightness - 10, 0)"
          />
          <component
            :is="Palette"
            :size="24"
            class="cursor-pointer hover:text-gray-300 transition-colors"
            @click="hue = (hue + 40) % 360"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { isDev } from '@/types'
  import { Sun, Moon, Palette } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      isHeight?: boolean
      maxHeightClass?: string
      isAdminOnly?: boolean
      defaultScale?: number
    }>(),
    {
      isHeight: true,
      maxHeightClass: 'h-64',
      isAdminOnly: false,
      defaultScale: 1,
    }
  )

  const hue = ref(200)
  const lightness = ref(50)
  const scale = ref(props.defaultScale ?? 1)
  const showTools = ref(false)
  let hideTimer: number | null = null

  const showTemporarily = () => {
    showTools.value = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => {
      showTools.value = false
    }, 2000) // 2秒後にフェードアウト
  }

  const heightClass = computed(() => {
    return props.isHeight ? props.maxHeightClass : 'h-auto'
  })

  const bgStyle = computed(() => ({
    backgroundColor: `hsl(${hue.value} 60% ${lightness.value}%)`,
  }))

  const contentStyle = computed(() => ({
    transform: `scale(${scale.value})`,
    width: scale.value < 1 ? `${100 / scale.value}%` : '100%',
    height: scale.value < 1 ? `${100 / scale.value}%` : '100%',
  }))
</script>
