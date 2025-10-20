<!-- src\ConfigMaker\components\postAction\items\SoundSettings.vue -->
<template>
  <!-- サウンド -->
  <SettingItem label="🔊 サウンド(dev)" description="フキダシ表示時に鳴らす音">
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">（なし）</option>
      <option v-for="s in soundList" :key="s" :value="s">
        {{ s }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { soundList } from '@/Toolkit/sounds/soundMap'

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
