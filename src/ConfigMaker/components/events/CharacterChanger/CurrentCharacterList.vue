<!-- src/ConfigMaker/components/events/CharacterChanger/CurrentCharacterList.vue -->
<template>
  <div class="bg-base-200 p-4 rounded-lg">
    <p class="text-sm font-semibold text-gray-600 mb-3">現在使用されているキャラクター:</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="charKey in characterKeys"
        :key="charKey"
        :class="['badge badge-lg', getCharacterName(charKey) ? 'badge-outline' : 'badge-error animate-pulse']"
      >
        {{ getCharacterName(charKey) || `⚠️ 未定義: ${charKey || '空欄'}` }}
        <span class="ml-1 text-xs opacity-70">({{ usageCount[charKey] }}箇所)</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'

  defineProps<{
    characterKeys: string[]
    usageCount: Record<string, number>
  }>()

  const { getCharacterName } = useCharacterManager()
</script>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
