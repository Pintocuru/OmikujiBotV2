<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionLayerEditor.vue -->
<template>
  <div class="space-y-2">
    <div class="text-xs font-medium text-base-content/70 mb-1">画像レイヤー</div>

    <button type="button" class="btn btn-xs btn-primary w-full" @click="handleAddLayer">
      <Plus class="w-3 h-3 mr-1" />レイヤーを追加
    </button>

    <div v-for="(layer, index) in layers" :key="index" class="border rounded p-2 bg-base-200 space-y-1">
      <div class="flex items-center gap-1">
        <span class="badge badge-xs">{{ index + 1 }}</span>
        <div class="flex-1" />
        <button type="button" class="btn btn-xs btn-outline" @click="handleSetDefaultPath">
          <RotateCcw class="w-3 h-3 mr-1" />パスをセット
        </button>
        <button type="button" class="btn btn-ghost btn-xs" @click="handleMoveUp(index)" :disabled="index === 0">
          <ChevronUp class="w-3 h-3" />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          @click="handleMoveDown(index)"
          :disabled="index === layers.length - 1"
        >
          <ChevronDown class="w-3 h-3" />
        </button>
        <button type="button" class="btn btn-error btn-xs" @click="handleRemoveLayer(index)">
          <X class="w-3 h-3" />
        </button>
      </div>

      <input
        type="url"
        class="input input-xs w-full"
        :placeholder="`レイヤー${index + 1}の画像URL`"
        :value="layer"
        @input="handleLayerUpdate(index, ($event.target as HTMLInputElement).value)"
      />
      <ImagePreview :layers="layer" :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RotateCcw, Plus, ChevronUp, ChevronDown, X } from 'lucide-vue-next'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'

  const props = defineProps<{
    src: string[]
    emotionKey: string
    selectedItemKey: string
  }>()

  const emit = defineEmits<{
    'update:src': [src: string[]]
  }>()

  const layers = computed(() => (Array.isArray(props.src) ? props.src : []))

  const imageExtensions = ['png', 'gif', 'webp', 'jpg', 'jpeg', 'svg', 'webm', 'mp4']
  const extensionIndex = ref(0)

  const handleSetDefaultPath = () => {
    const ext = imageExtensions[extensionIndex.value % imageExtensions.length]
    extensionIndex.value++
    const newPath = `${props.selectedItemKey}/${props.emotionKey}.${ext}`
    const newSrc = props.src.length === 0 ? [newPath] : [newPath, ...props.src.slice(1)]
    emit('update:src', newSrc)
  }

  const handleLayerUpdate = (index: number, value: string) => {
    const n = [...layers.value]
    n[index] = value
    emit('update:src', n)
  }
  const handleAddLayer = () => emit('update:src', [...layers.value, ''])
  const handleRemoveLayer = (index: number) =>
    emit(
      'update:src',
      layers.value.filter((_, i) => i !== index)
    )
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const n = [...layers.value]
    ;[n[index - 1], n[index]] = [n[index], n[index - 1]]
    emit('update:src', n)
  }
  const handleMoveDown = (index: number) => {
    if (index === layers.value.length - 1) return
    const n = [...layers.value]
    ;[n[index], n[index + 1]] = [n[index + 1], n[index]]
    emit('update:src', n)
  }
</script>
