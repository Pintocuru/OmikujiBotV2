<!-- src/configMaker/components/characters/parts/EmotionImageItem.vue -->
<template>
  <div class="form-control">
    <SettingItem
      :label="emotionLabel"
      :description="`(${emotionKey})`"
      :showReset="true"
      @reset="emit('reset', emotionKey)"
    >
      <ModeToggle :is-layer-mode="isLayerMode" @toggle="handleModeToggle" />

      <SingleImageMode
        v-if="!isLayerMode"
        :value="singleValue"
        :emotion-label="emotionLabel"
        @update="handleSingleUpdate"
      />

      <LayerImageMode
        v-else
        :layers="layerArray"
        :emotion-label="emotionLabel"
        @update="handleLayerUpdate"
        @add="handleAddLayer"
        @remove="handleRemoveLayer"
        @move-up="handleMoveUp"
        @move-down="handleMoveDown"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import ModeToggle from './ModeToggle.vue'
  import SingleImageMode from './SingleImageMode.vue'
  import LayerImageMode from './LayerImageMode.vue'

  const props = defineProps<{
    emotionKey: CharacterEmotionType
    emotionLabel: string
    currentValue: string | string[] | undefined
    selectedItemKey: string | null
  }>()

  const emit = defineEmits<{
    update: [key: CharacterEmotionType, value: string | string[] | undefined]
    reset: [key: CharacterEmotionType]
  }>()

  const isLayerMode = computed(() => Array.isArray(props.currentValue))
  const singleValue = computed(() => (typeof props.currentValue === 'string' ? props.currentValue : undefined))
  const layerArray = computed(() => (Array.isArray(props.currentValue) ? props.currentValue : []))

  const handleModeToggle = (toLayerMode: boolean) => {
    let newValue: string | string[] | undefined

    if (toLayerMode) {
      if (typeof props.currentValue === 'string' && props.currentValue) {
        newValue = [props.currentValue]
      } else {
        newValue = []
      }
    } else {
      if (Array.isArray(props.currentValue) && props.currentValue.length > 0) {
        newValue = props.currentValue[0]
      } else {
        newValue = undefined
      }
    }

    emit('update', props.emotionKey, newValue)
  }

  const handleSingleUpdate = (value: string) => {
    emit('update', props.emotionKey, value || undefined)
  }

  const handleLayerUpdate = (index: number, value: string) => {
    const layers = [...layerArray.value]
    layers[index] = value
    emit('update', props.emotionKey, layers)
  }

  const handleAddLayer = () => {
    const layers = [...layerArray.value, '']
    emit('update', props.emotionKey, layers)
  }

  const handleRemoveLayer = (index: number) => {
    const layers = layerArray.value.filter((_, i) => i !== index)
    emit('update', props.emotionKey, layers.length > 0 ? layers : undefined)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const layers = [...layerArray.value]
    ;[layers[index - 1], layers[index]] = [layers[index], layers[index - 1]]
    emit('update', props.emotionKey, layers)
  }

  const handleMoveDown = (index: number) => {
    const layers = [...layerArray.value]
    if (index === layers.length - 1) return
    ;[layers[index], layers[index + 1]] = [layers[index + 1], layers[index]]
    emit('update', props.emotionKey, layers)
  }
</script>
