<!-- src/ConfigMaker/UiEditor/CommentBubble/CharacterSlot.vue -->
<template>
  <div class="card shadow-lg p-2" :class="[cardStyle ? '' : 'shadow-inner', cardStyle || 'bg-base-200']">
    <div class="flex justify-between items-center mb-2">
      <h4 class="text-md font-semibold">{{ title }}</h4>
      <button v-if="showClear" class="btn btn-xs btn-error" @click="$emit('clear')">クリア</button>
    </div>

    <VueDraggable
      v-model="localItems"
      group="characters"
      :class="[
        'flex flex-wrap gap-2 p-2 min-h-[50px] rounded',
        showClear ? 'border border-dotted border-gray-400 bg-white' : 'border border-dashed border-gray-400',
      ]"
    >
      <span v-for="charKey in localItems" :key="charKey" :class="['badge cursor-grab', badgeStyle]">
        {{ characters[charKey]?.displayName || characters[charKey]?.name || charKey }}
      </span>

      <!-- footer 相当：空の時のプレースホルダー -->
      <div v-if="localItems.length === 0 && showClear" class="text-gray-400 italic text-sm">
        キャラクターをここにドラッグしてください
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { CharacterType } from '@/types'

  const props = withDefaults(
    defineProps<{
      slotName: string
      title: string
      badgeStyle: string
      cardStyle?: string
      characters: Record<string, CharacterType>
      items: string[]
      showClear?: boolean
    }>(),
    {
      cardStyle: '',
      showClear: true,
    }
  )

  const emit = defineEmits<{
    update: [items: string[]]
    clear: []
  }>()

  // ドラッグ用バッファ（無限ループ対策）
  const localItems = ref<string[]>([...props.items])

  // props → ローカル
  watch(
    () => props.items,
    (val) => {
      if (val.length === localItems.value.length && val.every((v, i) => v === localItems.value[i])) return
      localItems.value = [...val]
    }
  )

  // ローカル → 親
  watch(localItems, (val) => {
    if (val.length === props.items.length && val.every((v, i) => v === props.items[i])) return
    emit('update', [...val])
  })
</script>
