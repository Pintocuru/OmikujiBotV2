<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionGrid.vue -->
<template>
  <VueDraggable
    v-if="!readonly"
    v-model="draggableItems"
    :animation="150"
    handle=".drag-handle"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    @end="handleDragEnd"
  >
    <div
      v-for="item in draggableItems"
      :key="item.key"
      class="cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg hover:border-primary group"
      :class="selectedKey === item.key ? 'border-primary bg-primary/10' : 'border-base-200'"
      @click="emit('select', item.key)"
    >
      <EmotionCard :item="item" show-drag-handle />
    </div>
  </VueDraggable>

  <!-- readonly モード（IconSelectorModal 向け）: ドラッグ不可 -->
  <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <div
      v-for="item in draggableItems"
      :key="item.key"
      class="cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg hover:border-primary group"
      :class="selectedKey === item.key ? 'border-primary bg-primary/10' : 'border-base-200'"
      @click="emit('select', item.key)"
    >
      <EmotionCard :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import EmotionCard from './EmotionCard.vue'
  import type { CharacterImageType } from '@/types/'

  // ── 内部用型 ──────────────────────────────────────────────────────────────
  type EmotionEntry = {
    key: string
    value: CharacterImageType[string]
  }

  // ── Props / Emits ─────────────────────────────────────────────────────────
  const props = withDefaults(
    defineProps<{
      images: CharacterImageType
      selectedKey?: string
      readonly?: boolean
    }>(),
    { readonly: false }
  )

  const emit = defineEmits<{
    select: [key: string]
    reorder: [newImages: CharacterImageType]
  }>()

  // ── images オブジェクト → 配列へ変換 数値だとバグが起こるので修正してる
  const normalizeKey = (key: string) => (/^\d+$/.test(key) ? `k${key}` : key)
  const toEntries = (images: CharacterImageType) =>
    Object.entries(images).map(([key, value]) => ({
      key: normalizeKey(key),
      value,
    }))

  const draggableItems = ref<EmotionEntry[]>(toEntries(props.images))

  // 外部から images が変わったとき（追加・削除など）は配列を再同期する
  // ただしドラッグ中の不要な上書きを防ぐため、キー構成が変わった時だけ更新
  watch(
    () => props.images,
    (newImages) => {
      const newKeys = Object.keys(newImages).join(',')
      const currentKeys = draggableItems.value.map((e) => e.key).join(',')

      if (newKeys !== currentKeys) {
        // キー構成が変わった（追加・削除・並び替え）→ 全再構築
        draggableItems.value = toEntries(newImages)
      } else {
        // キーは同じ → 値だけ差し替え（label/src/animation の編集）
        draggableItems.value.forEach((entry) => {
          entry.value = newImages[entry.key]
        })
      }
    },
    { deep: false }
  )

  // ── ドラッグ完了 → 配列をオブジェクトに戻して emit ───────────────────────
  const handleDragEnd = () => {
    const reordered = Object.fromEntries(
      draggableItems.value.map(({ key, value }) => [key, value])
    ) as CharacterImageType
    emit('reorder', reordered)
  }
</script>
