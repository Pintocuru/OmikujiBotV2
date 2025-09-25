<!-- src/configMaker/components/postAction/PostActionWordPartySettings.vue -->
<template>
  <!-- WordParty -->
  <SettingItem label="🎉 WordParty" description="WordPartyで演出する内容">
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="0" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import WordPartyField from './WordPartyField.vue'
  import SettingItem from '@shared/components/parts/SettingItem.vue'

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
