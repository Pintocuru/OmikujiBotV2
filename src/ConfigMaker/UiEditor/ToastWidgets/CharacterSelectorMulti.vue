<!-- src/ConfigMaker/UiEditor/ToastWidgets/CharacterSelectorMulti.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="(character, key) in characters"
      :key="key"
      class="badge cursor-pointer p-3 transition-colors duration-150"
      :class="{
        'badge-primary': isSelected(key),
        'badge-ghost': !isSelected(key),
      }"
      @click="toggleSelection(key as string)"
    >
      {{ character.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CharacterType } from '@/types'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    selectedKeys: string[]
  }>()

  const emit = defineEmits(['update:selectedKeys'])

  const isSelected = (key: string) => props.selectedKeys.includes(key)

  const toggleSelection = (key: string) => {
    const currentSelection = [...props.selectedKeys]
    const index = currentSelection.indexOf(key)

    if (index > -1) currentSelection.splice(index, 1)
    else currentSelection.push(key)
    emit('update:selectedKeys', currentSelection)
  }
</script>
