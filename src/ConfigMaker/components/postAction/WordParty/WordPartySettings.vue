<!-- src\ConfigMaker\components\postAction\items\WordPartySettings.vue -->
<template>
  <!-- WordParty -->
  <SettingItem label="🎉 WordParty" description="WordPartyで演出する内容">
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="0" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionWordPartyType } from '@/types/'
  import WordPartyField from './WordPartyField.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  const props = defineProps<{
    action: PostActionWordPartyType
    characterOptions?: Array<{ value: string; label: string }>
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionWordPartyType]
  }>()

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionWordPartyType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // WordParty用のcomputedプロパティ
  const wordPartyValue = computed({
    get: () => props.action.wordParty,
    set: (value) => updateAction({ wordParty: value }),
  })
</script>
