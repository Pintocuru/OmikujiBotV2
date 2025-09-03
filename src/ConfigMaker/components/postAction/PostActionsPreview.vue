<!-- src/configMaker/components/postAction/PostActionsPreview.vue -->
<template>
  <div class="bg-base-200 rounded p-3 text-sm relative">
    <div v-if="modelValue.length !== 0" class="space-y-0">
      <div
        v-for="(action, index) in modelValue"
        :key="index"
        class="flex items-center gap-2 p-1 hover:bg-base-300 rounded"
      >
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="badge badge-primary badge-sm">{{ index + 1 }}</span>
          <span
            class="badge badge-accent badge-sm rounded tooltip tooltip-right"
            data-tip="チャットを受け取ってから発動するまでの遅延時間(秒)"
          >
            {{ action.delaySeconds }}s
          </span>
        </div>

        <div v-if="action.messageContent || action.messageToast" class="flex items-center gap-2 flex-shrink-0">
          <CharacterIcon
            :character-key="action.characterKey"
            :icon-key="action.iconKey"
            img-class="w-6 h-6 rounded-full"
            fallback-class="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-xs"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap gap-1 items-center">
            <span v-if="action.messageContent" class="tooltip tooltip-right" data-tip="BOTコメント"> 💬 </span>
            <span v-if="action.messageToast" class="tooltip tooltip-right" data-tip="トースト"> 🍞 </span>
            <span v-if="action.wordParty" class="tooltip tooltip-right" data-tip="WordParty"> 🎉 </span>
            <span class="text-base-content truncate">
              {{ action.messageContent || action.messageToast || action.wordParty }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-base-content/70 italic">Post Actions が設定されていません</div>
  </div>
</template>

<script setup lang="ts">
  import { PostActionType } from '@/types/'
  import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
  }>()
</script>
