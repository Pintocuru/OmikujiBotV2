<!-- src/ConfigMaker/components/postAction/Message/MessageSettings.vue -->
<template>
  <template v-if="showCharacterSettings">
    <SettingItem
      :variant="isDev && !isCharacter ? 'warning' : undefined"
      label="👤キャラクター・カラー"
      description="フキダシの色や読み上げのキャラクターを選択"
    >
      <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
        <option v-for="(name, key) in availableCharacters" :key="key" :value="key">
          {{ name }}
        </option>
      </select>
    </SettingItem>

    <SettingItem
      v-if="hasCharacterSelected"
      :variant="isDev && !isCharacter ? 'warning' : undefined"
      label="🎨 アイコン"
      description="表示する画像を選択"
    >
      <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
    </SettingItem>
  </template>

  <SettingItem v-if="enableSecondary" label="読み上げ対象" description="わんコメで読み上げするか">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="!isToast"
        @change="isToast = !($event.target as HTMLInputElement).checked"
      />
      <span>読み上げ対象 {{ !isToast ? 'ON' : 'OFF' }}</span>
    </label>
  </SettingItem>

  <SettingItem label="💬 メッセージ内容" description="プレースホルダーが使えます">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>

  <SettingItem v-if="soundEnabled" label="🔊 サウンド" description="フキダシ表示時に鳴らす音">
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">（なし）</option>
      <option v-for="(value, key) in soundMetaMap" :key="key" :value="key">{{ value }} ({{ key }})</option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType, isDev, PostFlowMessageType, soundMetaMap } from '@/types/'
  import IconSelector from '@config/components/postAction/IconSelector/IconSelector.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import MessageTextDialog from './MessageTextDialog.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    action: PostFlowMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType]
  }>()

  // --- Data Fetching ---
  const { data } = useOmikujiStore()
  const { isCharacter } = useVisibilityAccess()
  const { characterMap } = useCharacterManager()

  const enableSecondary = computed(() => data.components.enableSecondary)
  const soundEnabled = computed(() => data.settings.soundEnabled)

  const SYSTEM_BOT_MAP = {
    omiken: 'おみくじBOT(その1)',
    omiken2: 'おみくじBOT(その2)',
  } as const

  // --- Computed Properties ---

  // 表示すべきキャラクターリストを判定
  const availableCharacters = computed(() => {
    if (isCharacter.value) {
      // 既存の characterMap から名前だけを抽出したオブジェクトを返す
      return Object.fromEntries(Object.entries(characterMap.value).map(([k, v]) => [k, v.name]))
    }
    return SYSTEM_BOT_MAP
  })

  const showCharacterSettings = computed(() => isCharacter.value || isDev)
  const hasCharacterSelected = computed(() => !!props.action.characterKey)

  // --- Helper Functions ---
  const updateAction = (updates: Partial<PostFlowMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // --- V-Models ---
  const characterKey = computed({
    get: () => props.action.characterKey ?? '',
    set: (value) => updateAction({ characterKey: value }),
  })

  const isToast = computed<boolean>({
    get: () => props.action.message.isToast,
    set: (value) =>
      updateAction({
        message: { ...props.action.message, isToast: value },
      }),
  })

  const bubbleText = computed<string>({
    get: () => props.action.message.bubble ?? '',
    set: (value) =>
      updateAction({
        message: { ...props.action.message, bubble: value },
      }),
  })

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })

  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value as CharacterEmotionType })
  }
</script>
