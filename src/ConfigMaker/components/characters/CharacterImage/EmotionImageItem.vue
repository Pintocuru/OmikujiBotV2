<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionImageItem.vue -->
<template>
  <SettingItem
    :label="emotionLabel"
    :description="`(${emotionKey})`"
    :variant="emotionKey === 'default' && !props.isDefaultFilled ? 'warning' : undefined"
    :showWarning="emotionKey === 'default' && !props.isDefaultFilled"
    :showReset="true"
    @reset="emit('reset', emotionKey)"
  >
    <div class="space-y-2">
      <!-- レイヤー追加ボタン -->
      <button type="button" class="btn btn-xs flex items-center btn-primary" @click="handleAddLayer">
        <Plus class="w-4 h-4 mr-1" />
        レイヤーを追加
      </button>

      <!-- 各レイヤー -->
      <div
        v-for="(layer, index) in layers"
        :key="index"
        :class="['transition-all', layers.length > 1 ? 'border rounded p-2 bg-base-200' : 'bg-base-200']"
      >
        <!-- 複数レイヤーの場合はコントロール表示 -->
        <div v-if="layers.length > 1" class="flex items-center gap-2 mb-1">
          <span class="badge badge-sm">{{ index + 1 }}</span>
          <div class="flex-1"></div>
          <button
            type="button"
            class="btn btn-ghost btn-xs"
            @click="handleMoveUp(index)"
            :disabled="index === 0"
            title="前面へ移動"
          >
            <ChevronUp class="w-3 h-3" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs"
            @click="handleMoveDown(index)"
            :disabled="index === layers.length - 1"
            title="背面へ移動"
          >
            <ChevronDown class="w-3 h-3" />
          </button>
          <button type="button" class="btn btn-error btn-xs" @click="handleRemoveLayer(index)" title="削除">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- 画像URL入力 -->
        <input
          type="url"
          class="input input-sm w-full"
          :placeholder="`レイヤー${index + 1}の画像URL`"
          :value="layer"
          @input="handleLayerUpdate(index, ($event.target as HTMLInputElement).value)"
        />

        <!-- 個別プレビュー -->
        <ImagePreview :layers="layer" :size="layers.length > 1 ? 16 : 32" />
      </div>

      <!-- 合成プレビュー -->
      <template v-if="layers.length > 1">
        <div class="text-xs text-base-content/60 mb-1">合成プレビュー:</div>
        <ImagePreview :layers="layers" :size="32" />
      </template>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType } from '@/types/'
  import { Plus, ChevronUp, ChevronDown, X } from 'lucide-vue-next'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'

  const props = defineProps<{
    emotionKey: CharacterEmotionType
    emotionLabel: string
    currentValue: string[]
    selectedItemKey: string | null
    isDefaultFilled: boolean
  }>()

  const emit = defineEmits<{
    update: [key: CharacterEmotionType, value: string[]]
    reset: [key: CharacterEmotionType]
  }>()

  const layers = computed(() => (Array.isArray(props.currentValue) ? props.currentValue : []))

  const handleLayerUpdate = (index: number, value: string) => {
    const newLayers = [...layers.value]
    newLayers[index] = value
    emit('update', props.emotionKey, newLayers)
  }

  const handleAddLayer = () => {
    emit('update', props.emotionKey, [...layers.value, ''])
  }

  const handleRemoveLayer = (index: number) => {
    const newLayers = layers.value.filter((_, i) => i !== index)
    emit('update', props.emotionKey, newLayers)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newLayers = [...layers.value]
    ;[newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]]
    emit('update', props.emotionKey, newLayers)
  }

  const handleMoveDown = (index: number) => {
    if (index === layers.value.length - 1) return
    const newLayers = [...layers.value]
    ;[newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]]
    emit('update', props.emotionKey, newLayers)
  }
</script>
