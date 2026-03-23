<!-- src/ConfigMaker/components/events/CharacterChanger/CharacterMappingEditor.vue -->
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold text-md">キャラクターの変更設定</h4>
      <button class="btn btn-sm btn-ghost" @click="$emit('clearAll')" :disabled="!hasChanges">すべてクリア</button>
    </div>

    <div
      v-for="charKey in characterKeys"
      :key="charKey"
      class="flex items-center gap-3 p-4 bg-base-100 rounded-lg border-2 transition-all"
      :class="getCharacterName(charKey) ? 'border-base-300' : 'border-error shadow-error/20 shadow-lg'"
    >
      <!-- 変更前 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">変更前</p>
        <div
          :class="[
            'badge badge-lg w-full justify-start truncate',
            getCharacterName(charKey) ? 'badge-outline' : 'badge-error',
          ]"
        >
          {{ getCharacterName(charKey) || `⚠️ ${charKey || '空欄'}` }}
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ usageCount[charKey] }}箇所で使用中</p>
      </div>

      <!-- 矢印 -->
      <div class="text-3xl text-gray-400 flex-shrink-0">→</div>

      <!-- 変更後 -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 mb-1">変更後</p>
        <select
          :value="getMappingValue(charKey)"
          @input="updateMapping(charKey, ($event.target as HTMLSelectElement).value)"
          class="select select-bordered w-full"
          :class="getMappingValue(charKey) ? 'select-primary' : ''"
        >
          <option value="">変更しない</option>
          <option v-for="character in characterArray" :key="character.key" :value="character.key">
            {{ character.name || character.key }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'

  const props = defineProps<{
    characterKeys: string[]
    characterMappings: Record<string, string>
    usageCount: Record<string, number>
    hasChanges: boolean
  }>()

  const emit = defineEmits<{
    clearAll: []
    updateMapping: [charKey: string, value: string]
  }>()

  const { characterArray, getCharacterName } = useCharacterManager()

  // マッピング値を取得
  const getMappingValue = (charKey: string) => props.characterMappings[charKey] || ''

  // マッピング値を更新
  const updateMapping = (charKey: string, value: string) => {
    emit('updateMapping', charKey, value)
  }
</script>
