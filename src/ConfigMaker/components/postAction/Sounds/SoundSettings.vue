<!-- src\ConfigMaker\components\postAction\items\SoundSettings.vue -->
<template>
  <!-- サウンド -->
  <SettingItem label="🔊 サウンド" description="フキダシ表示時に鳴らす音">
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
  import { PostActionMessageType, PostActionSoundType } from '@/types/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { soundList } from '@sounds/soundMap'

  const props = defineProps<{
    action: PostActionMessageType | PostActionSoundType
    characterOptions?: Array<{ value: string; label: string }>
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionMessageType | PostActionSoundType]
  }>()

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionMessageType | PostActionSoundType>) => {
    // 結合後のオブジェクトを、元の props.action の型としてアサーションする
    const updatedAction = { ...props.action, ...updates } as PostActionMessageType | PostActionSoundType
    emit('update:action', updatedAction)
  }

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })
</script>
