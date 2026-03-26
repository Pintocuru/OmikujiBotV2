<!-- src/ConfigMaker/UiEditor/FlashBanner/FlashBannerPreview.vue -->
<template>
  <HudPreview :maxHeightClass="isDev ? 'min-h-32' : ''" :isAdminOnly="true">
    <div :class="[fontFamily]" @click="handlePreviewClick">
      <FlashBannerSelector
        :settings="settings"
        :message="defaultComment || '(デフォルトメッセージが設定されない場合、自動的に枠が非表示になります)'"
        :layers="iconSrc(settings.defaultCharacterKey, 'default')"
        :color="getCharacterColor(settings.defaultCharacterKey)"
        :label-class="blinkClass"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { defaultPlaceholdersShortLabels, isDev, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import FlashBannerSelector from '@main/ui/FlashBanner/parts/FlashBannerSelector.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
  import { useDelayedBlink } from '@main/ui/FlashBanner/parts/useDelayedBlink'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import type { FlashBannerType } from '@/types/OmikujiData/'

  const props = defineProps<{
    settings: FlashBannerType
    messageText: string
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { getCharacterColor, iconSrc } = useCharacterManager()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  // Blink Control
  const { blinkClass, triggerBlink } = useDelayedBlink({
    transitionDuration: 0,
    blinkDuration: 750,
  })

  const defaultMessageRefreshKey = ref(0)

  const handlePreviewClick = async () => {
    defaultMessageRefreshKey.value++
    await triggerBlink(false)
  }

  // Default Comment with Placeholders
  const defaultComment = computed(() => {
    void defaultMessageRefreshKey.value
    const contentPlaceholder = new ContentPlaceholder(data.value.placeholders)
    contentPlaceholder.updateResolvedValues(defaultPlaceholdersShortLabels)
    return contentPlaceholder.processText(props.messageText)
  })
</script>
