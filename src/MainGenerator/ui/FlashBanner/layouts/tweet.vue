<!-- src/MainGenerator/ui/FlashBanner/layouts/tweet.vue -->
<template>
  <div class="flex items-end gap-2" :class="[settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row']">
    <!-- アイコン + フキダシ（縦積み） -->
    <div
      v-if="shouldShowIcon"
      class="shrink-0 flex flex-col gap-0"
      :class="[settings.showItemOnRight ? 'items-end' : 'items-start']"
    >
      <!-- フキダシエリア（高さ固定：2行分 + 三角） -->
      <div class="flex flex-col h-[88px] justify-end" :class="[settings.showItemOnRight ? 'items-end' : 'items-start']">
        <MotionWrapper v-if="shouldShowMessage" :visible="shouldShowMessage" motion="slideUp">
          <div class="flex flex-col" :class="[settings.showItemOnRight ? 'items-end' : 'items-start']">
            <!-- メッセージボックス（2行固定） -->
            <div class="rounded-2xl border border-base-content/70 bg-base-100 px-3 py-2 max-w-sm">
              <span
                class="block font-bold text-xl text-base-content leading-snug break-words line-clamp-2"
                v-html="displayMessage"
              />
            </div>
            <!-- 吹き出しの三角（下向き） -->
            <div
              class="w-6 h-2"
              :style="[settings.showItemOnRight ? { marginRight: triangleOffset } : { marginLeft: triangleOffset }]"
            >
              <svg width="24" height="8" viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg" class="overflow-visible">
                <polygon points="2,0 22,0 12,8" class="fill-base-content/70" style="opacity: 0.7" />
                <polygon points="3,0 21,0 12,7" class="fill-base-100" />
              </svg>
            </div>
          </div>
        </MotionWrapper>
      </div>

      <!-- アイコン本体 -->
      <div :class="[settings.showItemOnRight ? 'mr-6' : 'ml-6']">
        <LayerImage :layers="characterLayers" :size="settings.iconSize" :animation="characterAnimation" />
      </div>
    </div>

    <!-- アイコンなし時のフキダシ単独表示 -->
    <MotionWrapper v-else-if="shouldShowMessage" :visible="shouldShowMessage" motion="slideUp">
      <div class="rounded-2xl border border-base-content/70 bg-base-100 px-3 py-2 max-w-sm">
        <span
          class="block font-bold text-xl text-base-content leading-snug break-words line-clamp-2"
          v-html="displayMessage"
        />
      </div>
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterAnimationType, CharacterColorType, FlashBannerType } from '@/types/OmikujiData/'
  import { useMessageTransition } from '../composables/useMessageTransition'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import MotionWrapper from '@/MainGenerator/ui/CommentBubble/MotionVariants/MotionWrapper.vue'

  const props = defineProps<{
    settings: FlashBannerType
    message: string
    characterLayers: string[]
    characterAnimation?: CharacterAnimationType
    color: CharacterColorType
    labelClass?: string
  }>()

  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.characterLayers.length > 0)

  const { displayMessage } = useMessageTransition(() => props.message)

  const shouldShowMessage = computed(() => props.message.trim().length > 0)

  const triangleOffset = computed(() => {
    const iconPx = props.settings.iconSize * 4
    const iconMargin = 24 // ml-6 / mr-6 = 1.5rem = 24px
    const center = iconMargin + iconPx / 2
    return `${center - 12}px`
  })
</script>
