<!-- src/ConfigMaker/UiEditor/ToastWidgets/CharacterSelectorSingle.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <!-- null 選択肢 -->
    <div
      class="badge cursor-pointer p-3 transition-colors duration-150"
      :class="{
        'badge-primary': isSelected(null),
        'badge-ghost': !isSelected(null),
      }"
      @click="select(null)"
    >
      なし
    </div>

    <!-- 通常キャラ一覧 -->
    <div
      v-for="(character, key) in characters"
      :key="key"
      class="badge cursor-pointer p-3 transition-colors duration-150"
      :class="{
        'badge-primary': isSelected(key),
        'badge-ghost': !isSelected(key),
      }"
      @click="select(key as string)"
    >
      {{ character.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CharacterType } from '@/types'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    selectedKey: string | null
  }>()

  const emit = defineEmits(['update:selectedKey'])

  const isSelected = (key: string | null) => props.selectedKey === key

  const select = (key: string | null) => {
    if (props.selectedKey === key) return
    emit('update:selectedKey', key)
  }
</script>
