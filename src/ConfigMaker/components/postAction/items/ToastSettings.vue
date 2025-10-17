<!-- src\ConfigMaker\components\postAction\items\ToastSettings.vue -->
<template>
  <SettingItem label="👤キャラクター・カラー" description="フキダシの色や読み上げのキャラクターを選択">
    <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
      <option v-for="char in characterOptions" :key="char.value" :value="char.value">
        {{ char.label }}
      </option>
    </select>
  </SettingItem>

  <!-- トーストメッセージ -->
  <SettingItem label="📝 トーストメッセージ" description="トーストに表示する内容">
    <input
      type="text"
      v-model="messageToast"
      class="input input-bordered input-sm w-full"
      placeholder="トーストとして表示するメッセージを入力してください"
    />
    <PlaceholderChecker :text="messageToast" />
  </SettingItem>

  <!-- WordParty -->
  <SettingItem label="🎉 WordParty" description="WordPartyで演出する内容">
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="0" />
  </SettingItem>

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
  import { isDev, PostActionType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import PlaceholderChecker from './PlaceholderChecker.vue'
  import WordPartyField from './WordPartyField.vue'
  import { soundList } from '@/Toolkit/sounds/soundMap'

  const props = defineProps<{
    action: PostActionType
    characterOptions: Array<{ value: string; label: string }>
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionType]
  }>()

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // Computed properties
  const characterKey = computed({
    get: () => props.action.characterKey,
    set: (value) => updateAction({ characterKey: value }),
  })

  const messageToast = computed({
    get: () => props.action.messageToast || '',
    set: (value) => updateAction({ messageToast: value || undefined }),
  })

  const wordPartyValue = computed({
    get: () => props.action.wordParty || '',
    set: (value) => updateAction({ wordParty: value || undefined }),
  })

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })
</script>
