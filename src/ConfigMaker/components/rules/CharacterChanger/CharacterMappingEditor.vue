<!-- src/ConfigMaker/components/rules/CharacterChanger/components/CharacterMappingEditor.vue -->
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
          v-model="characterMappings[charKey]"
          class="select select-bordered w-full"
          :class="characterMappings[charKey] ? 'select-primary' : ''"
        >
          <option value="">変更しない</option>
          <option v-for="character in charactersArray" :key="character.key" :value="character.key">
            {{ character.name || character.key }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // FIXME
  defineProps<{
    characterKeys: string[]
    characterMappings: Record<string, string>
    charactersArray: Array<{ key: string; name: string; order: number }>
    usageCount: Record<string, number>
    getCharacterName: (id: string) => string
    hasChanges: boolean
  }>()

  defineEmits<{
    clearAll: []
  }>()
</script>
