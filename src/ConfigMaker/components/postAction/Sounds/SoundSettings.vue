<!-- src/ConfigMaker/components/postAction/Sounds/SoundSettings.vue -->
<template>
  <SettingItem label="🔊 サウンド" description="フキダシ表示時に鳴らす音">
    <!-- プリセット選択 -->
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">（なし）</option>
      <option v-for="(value, key) in soundMap" :key="key" :value="key">{{ value.label }} ({{ key }})</option>
    </select>
  </SettingItem>

  <!-- カスタムパス -->
  <SettingItem label="🔊 カスタムサウンド" description="assets/sounds/ からの相対パス">
    <input
      v-model="soundPath"
      type="text"
      placeholder="例: MySounds/custom.mp3"
      class="input input-bordered input-sm w-full"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowMessageType, PostFlowSoundType, soundMap } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  const props = defineProps<{
    action: PostFlowMessageType | PostFlowSoundType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType | PostFlowSoundType]
  }>()

  const updateAction = (updates: Partial<PostFlowMessageType | PostFlowSoundType>) => {
    const updatedAction = { ...props.action, ...updates } as PostFlowMessageType | PostFlowSoundType
    emit('update:action', updatedAction)
  }

  // プリセット選択時は soundPath をクリア
  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined, soundPath: '' }),
  })

  // カスタムパス入力時は sound をクリア
  const soundPath = computed({
    get: () => props.action.soundPath || '',
    set: (value) => updateAction({ soundPath: value || '', sound: value ? '' : props.action.sound }),
  })
</script>
