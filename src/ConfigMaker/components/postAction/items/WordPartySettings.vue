<!-- src\ConfigMaker\components\postAction\items\WordPartySettings.vue -->
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
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  const props = defineProps<{
    action: PostActionType
    characterOptions?: Array<{ value: string; label: string }>
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

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })
</script>
