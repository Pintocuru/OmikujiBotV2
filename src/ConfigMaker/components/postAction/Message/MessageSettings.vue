<!-- src\ConfigMaker\components\postAction\items\MessageSettings.vue -->
<template>
  <!-- キャラクター選択 -->
  <div v-if="isCharacter" class="space-y-2">
    <SettingItem label="👤キャラクター・カラー" description="フキダシの色や読み上げのキャラクターを選択">
      <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
        <option v-for="char in characterOptions" :key="char.value" :value="char.value">
          {{ char.label }}
        </option>
      </select>
    </SettingItem>

    <!-- アイコン選択 -->
    <SettingItem v-if="characterKey !== ''" label="🎨 アイコン" description="表示する画像を選択">
      <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
    </SettingItem>
  </div>

  <!-- 表示形式の選択（単一） -->
  <SettingItem label="表示形式" description="フキダシかトーストを選択してください">
    <label class="mr-4">
      <input type="radio" value="bubble" :checked="messageType === 'bubble'" @change="handleTypeChange" />
      💬 フキダシ
    </label>
    <label>
      <input type="radio" value="toast" :checked="messageType === 'toast'" @change="handleTypeChange" />
      📝 トースト
    </label>
  </SettingItem>

  <!-- 単一の入力欄：messageType に応じてラベル／説明／プレースホルダ／バインド先を切替 -->
  <SettingItem
    :label="messageType === 'bubble' ? '💬 フキダシ内容' : '📝 トースト内容'"
    :description="messageType === 'bubble' ? 'フキダシに表示する内容' : 'トーストに表示する内容'"
  >
    <div class="relative w-full">
      <!-- input -->
      <input
        v-model="messageText"
        type="text"
        class="input input-bordered input-sm w-full pr-10"
        :placeholder="messageType === 'bubble' ? 'フキダシのメッセージを入力' : 'トーストのメッセージを入力'"
        :class="{ hidden: isTextarea }"
      />

      <!-- textarea -->
      <textarea
        v-model="messageText"
        rows="3"
        class="textarea textarea-bordered textarea-sm w-full pr-10"
        :placeholder="messageType === 'bubble' ? 'フキダシのメッセージを入力' : 'トーストのメッセージを入力'"
        :class="{ hidden: !isTextarea }"
      ></textarea>

      <!-- 切り替えボタン -->
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
        @click="isTextarea = !isTextarea"
      >
        <AlignLeft v-if="!isTextarea" class="w-4 h-4" />
        <AlignJustify v-else class="w-4 h-4" />
      </button>
    </div>
  </SettingItem>

  <!-- 変数プレースホルダーチェッカー -->
  <VariableDeclarationChecker v-if="messageText !== ''" :text="messageText" />

  <!-- プレースホルダーチェッカー -->
  <PlaceholderChecker v-if="messageText !== ''" :text="messageText" />

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
  import { computed, ref } from 'vue'
  import { CharacterEmotionType, PostActionMessageType } from '@/types/'
  import IconSelector from '@config/components/postAction/IconSelector/IconSelector.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import VariableDeclarationChecker from '../items/VariableDeclarationChecker.vue'
  import PlaceholderChecker from '../items/PlaceholderChecker.vue'
  import { soundList } from '@sounds/soundMap'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { AlignLeft, AlignJustify } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostActionMessageType
    characterOptions: Array<{ value: string; label: string }>
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionMessageType]
  }>()

  const { isCharacter } = useVisibilityAccess()

  const isTextarea = ref(false)

  const updateAction = (updates: Partial<PostActionMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const characterKey = computed({
    get: () => props.action.characterKey,
    set: (value) => updateAction({ characterKey: value }),
  })

  // 既存値から初期選択を決定
  const messageType = computed<'bubble' | 'toast'>(() => {
    const msg = props.action.message
    return msg.bubble && msg.bubble !== '' ? 'bubble' : msg.toast && msg.toast !== '' ? 'toast' : 'bubble'
  })

  // 単一 input の v-model 用（選択側の値だけを編集）
  const messageText = computed<string>({
    get: () =>
      messageType.value === 'bubble' ? (props.action.message.bubble ?? '') : (props.action.message.toast ?? ''),
    set: (value) => {
      if (messageType.value === 'bubble') {
        updateAction({
          message: {
            ...props.action.message,
            bubble: value,
          },
        })
      } else {
        updateAction({
          message: {
            ...props.action.message,
            toast: value,
          },
        })
      }
    },
  })

  // ラジオ切替：選択を変えた瞬間に「選ばれた側へ内容を移し、元の側を空にする」
  const handleTypeChange = (event: Event) => {
    const newType = (event.target as HTMLInputElement).value as 'bubble' | 'toast'
    const prevType = messageType.value

    if (newType === prevType) return

    if (newType === 'toast') {
      updateAction({
        message: {
          ...props.action.message,
          toast: props.action.message.bubble ?? '',
          bubble: '',
        },
      })
    } else {
      updateAction({
        message: {
          ...props.action.message,
          bubble: props.action.message.toast ?? '',
          toast: '',
        },
      })
    }
  }

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })

  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value as CharacterEmotionType })
  }
</script>
