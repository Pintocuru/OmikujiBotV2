<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionPresetButtons.vue -->
<template>
  <div class="flex flex-wrap gap-1">
    <span class="text-xs text-base-content/50 self-center mr-1">プリセット:</span>
    <button
      v-for="{ key, label } in presets"
      :key="key"
      type="button"
      class="btn btn-xs"
      :class="existingKeys.includes(key) ? 'btn-disabled opacity-40' : 'btn-outline'"
      :disabled="existingKeys.includes(key)"
      @click="emit('add', key, label)"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { characterEmotionMap } from '@/types/'

  const PRESET_KEYS = ['default', 'happy', 'surprised', 'sad', 'angry', 'thinking'] as const

  const presets = PRESET_KEYS.map((key) => ({
    key,
    label: characterEmotionMap[key], // "デフォルト" のように括弧を除去
  }))

  defineProps<{
    existingKeys: string[]
  }>()

  const emit = defineEmits<{
    add: [key: string, label: string]
  }>()
</script>
