<!-- src/ConfigMaker/components/UiEditor/LiveClock/LiveClockPreview.vue -->
<template>
  <HudPreview :maxHeightClass="isDev ? 'min-h-32' : ''" :isAdminOnly="true">
    <div :class="[fontFamily]">
      <LiveClockSelector
        :settings="settings"
        :default-message="defaultMessage"
        :is-mounted="isMounted"
        :is-flipped="isFlipped"
        :current-msg="currentMsg"
        @click="isFlipped = !isFlipped"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, useFontFamily } from '@/types/'
  import type { SettingsClockType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import LiveClockSelector from '@main/ui/LiveClock/parts/LiveClockSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import { usePlaceholderInterval } from '@/MainGenerator/ui/common/usePlaceholderInterval'

  const props = defineProps<{
    settings: SettingsClockType
    messageText: string
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))
  const settings = computed(() => props.settings)

  const {
    message: defaultMessage,
    registerIntervalHook,
    commitIfPending,
  } = usePlaceholderInterval(() => settings.value.defaultMessage ?? '', 5000)
  registerIntervalHook(() => {
    commitIfPending(!isFlipped.value)
  })

  const currentMsg = ref('テストメッセージです！テストメッセージです！')

  const isMounted = ref(false) // 表示アニメーションON
  const isFlipped = ref(false) // コメント表示状態

  onMounted(() => {
    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })
</script>
