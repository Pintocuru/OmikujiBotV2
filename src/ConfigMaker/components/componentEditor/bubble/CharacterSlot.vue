<!-- src\ConfigMaker\components\componentEditor\bubble\CharacterSlot.vue -->
<template>
  <div :class="['card shadow-lg p-3 border', cardStyle || 'bg-base-200', showClear ? '' : 'shadow-inner']">
    <div class="flex justify-between items-center mb-2">
      <h4 class="text-md font-semibold" :class="titleClass">{{ title }}</h4>
      <button v-if="showClear" class="btn btn-xs btn-error" @click="$emit('clear')">クリア</button>
    </div>

    <draggable
      :model-value="items"
      item-key="key"
      group="characters"
      :class="[
        'flex flex-wrap gap-2 p-2 min-h-[50px] rounded',
        showClear ? 'border border-dotted border-gray-400 bg-white' : 'border border-dashed border-gray-400',
      ]"
      @update:model-value="$emit('update', $event)"
    >
      <template #item="{ element: charKey }">
        <span :class="['badge cursor-grab', badgeStyle]">
          {{ characters[charKey]?.displayName || charKey }}
        </span>
      </template>
      <template #footer>
        <div v-if="items.length === 0 && showClear" class="text-gray-400 italic text-sm">
          キャラクターをここにドラッグしてください
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import draggable from 'vuedraggable'

  interface Props {
    slotName: string
    title: string
    badgeStyle: string
    cardStyle?: string
    characters: Record<string, { displayName?: string }>
    items: string[]
    showClear?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    cardStyle: '',
    showClear: true,
  })

  defineEmits<{
    update: [items: string[]]
    clear: []
  }>()

  const titleClass = computed(() => {
    const styleMap: Record<string, string> = {
      'badge-primary': 'text-primary',
      'badge-secondary': 'text-secondary',
      'badge-accent': 'text-accent',
      'badge-info': 'text-info',
    }
    return styleMap[props.badgeStyle] || 'text-secondary'
  })
</script>
