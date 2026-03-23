<!-- src/ConfigMaker/components/events/CharacterChanger/MappingPreview.vue -->
<template>
  <div class="alert alert-warning">
    <AlertTriangle class="w-4 h-4" />
    <div class="flex-1">
      <span class="font-semibold">変更内容の確認</span>
      <ul class="text-sm mt-2 space-y-1">
        <li v-for="(newCharId, oldCharKey) in characterMappings" :key="oldCharKey">
          <span v-if="newCharId">
            「{{ getCharacterName(oldCharKey) || oldCharKey }}」 → 「{{ getCharacterName(newCharId) }}」 ({{
              usageCount[oldCharKey]
            }}箇所)
          </span>
        </li>
      </ul>
      <p class="text-sm mt-3 font-semibold text-warning-content">
        ⚠️ この操作は{{ scopeLabel }}に影響します。元に戻すことはできません。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import { AlertTriangle } from 'lucide-vue-next'

  defineProps<{
    characterMappings: Record<string, string>
    usageCount: Record<string, number>
    scopeLabel: string
  }>()

  const { getCharacterName } = useCharacterManager()
</script>
