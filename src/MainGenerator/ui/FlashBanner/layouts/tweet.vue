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
        <MotionWrapper v-if="shouldShowMessage" :visible="shouldShowMessage" motion="bounce">
          <tweetParts
            :message="displayMessage"
            :align="settings.showItemOnRight ? 'right' : 'left'"
            :showTriangle="true"
            :triangleOffset="triangleOffset"
          />
        </MotionWrapper>
      </div>

      <!-- アイコン本体 -->
      <div :class="[settings.showItemOnRight ? 'mr-6' : 'ml-6']">
        <LayerImage :layers="characterLayers" :size="settings.iconSize" :animation="characterAnimation" />
      </div>
    </div>

    <!-- アイコンなし時のフキダシ単独表示 -->
    <MotionWrapper v-else-if="shouldShowMessage" :visible="shouldShowMessage" motion="bounce">
      <tweetParts :message="displayMessage" :align="settings.showItemOnRight ? 'right' : 'left'" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterAnimationType, CharacterColorType, FlashBannerType } from '@/types/'
  import tweetParts from '../layouts/tweetParts.vue'
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
