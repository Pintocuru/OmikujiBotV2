<!-- src/configMaker/components/parts/CharacterIcon.vue -->
<template>
  <div class="tooltip tooltip-right" :data-tip="tooltipText">
    <LayerImage :size="size" :layers="iconSrc" :round="true" :show-placeholder="true" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { emotionLabels, CharacterEmotionType } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import LayerImage from '@/common/LayerImage.vue'

  const props = defineProps<{
    characterKey: string
    iconKey: CharacterEmotionType
    size?: number
  }>()

  const omikujiStore = useOmikujiStore()
  const charactersMap = computed(() => omikujiStore.getCategoryMap('characters'))

  const iconSrc = computed(() => {
    return charactersMap.value[props.characterKey]?.image?.[props.iconKey]
  })

  const tooltipText = computed(() => {
    const character = charactersMap.value[props.characterKey]
    if (!character) return 'キャラクターなし'

    const charName = character.name || '名前なし'
    const emotion = emotionLabels[props.iconKey] || '表情なし'
    return `${charName} (${emotion})`
  })
</script>
