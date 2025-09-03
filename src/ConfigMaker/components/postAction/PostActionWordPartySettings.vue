<!-- src/configMaker/components/postAction/PostActionWordPartySettings.vue -->
<template>
  <div class="space-y-4">
    <h3 class="text-sm font-medium flex items-center gap-2">
      <span>🎉 WordParty設定</span>
    </h3>

    <!-- WordParty内容 -->
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="0" />

    <div class="alert alert-info">
      <div class="text-sm">
        <p class="font-medium">💡 WordPartyについて</p>
        <p class="text-xs mt-1">WordPartyは特殊なエフェクトやアクションを実行するためのコマンドです。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import WordPartyField from './WordPartyField.vue'

  const props = defineProps<{
    action: PostActionType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionType]
  }>()

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // WordParty用のcomputedプロパティ
  const wordPartyValue = computed({
    get: () => props.action.wordParty,
    set: (value) => updateAction({ wordParty: value }),
  })
</script>
