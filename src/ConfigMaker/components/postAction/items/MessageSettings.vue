<!-- src\ConfigMaker\components\postAction\items\MessageSettings.vue -->
<template>
  <!-- キャラクター選択 -->
  <SettingItem label="👤キャラクター・カラー" description="フキダシの色や読み上げのキャラクターを選択">
    <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
      <option v-for="char in characterOptions" :key="char.value" :value="char.value">
        {{ char.label }}
      </option>
    </select>
  </SettingItem>

  <!-- アイコン選択 -->
  <SettingItem v-if="isDev && characterKey !== ''" label="🎨 アイコン" description="表示する画像を選択">
    <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
  </SettingItem>

  <!-- エンターモーション -->
  <SettingItem
    v-if="isDev && characterKey !== ''"
    label="✨ 表示アニメーション(dev)"
    description="キャラクターにかかるアニメーションを選択"
  >
    <select v-model="enterMotion" class="select select-bordered select-sm w-full max-w-xs">
      <option value="">なし</option>
      <option v-for="animation in motionLabel" :key="animation" :value="animation">
        {{ animation }}
      </option>
    </select>
  </SettingItem>

  <!-- メッセージ内容 -->
  <SettingItem label="📝 メッセージ内容" description="フキダシに表示する内容">
    <input
      type="text"
      v-model="messageContent"
      class="input input-bordered input-sm w-full"
      placeholder="投稿するメッセージを入力してください"
    />
  </SettingItem>

  <!-- WordParty -->
  <SettingItem label="🎉 WordParty" description="WordPartyで演出する内容">
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="0" />
  </SettingItem>

  <!-- サウンド -->
  <SettingItem v-if="isDev" label="🔊 サウンド(dev)" description="フキダシ表示時に鳴らす音">
    <input
      type="text"
      v-model="sound"
      class="input input-bordered input-sm"
      placeholder="サウンドファイル名（オプション）"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType, CharacterEmotionType, isDev } from '@/types/'
  import WordPartyField from './WordPartyField.vue'
  import IconSelector from '@ConfigComponents/rules/IconSelector.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

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

  const messageContent = computed({
    get: () => props.action.messageContent,
    set: (value) => updateAction({ messageContent: value }),
  })

  const wordPartyValue = computed({
    get: () => props.action.wordParty,
    set: (value) => updateAction({ wordParty: value }),
  })

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })

  const enterMotion = computed({
    get: () => props.action.enterMotion || '',
    set: (value) => updateAction({ enterMotion: value || undefined }),
  })

  // アイコン更新（型安全にするため）
  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value as CharacterEmotionType })
  }
</script>
