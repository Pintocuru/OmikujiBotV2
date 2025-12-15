<!-- src\ConfigMaker\components\postAction\items\PostActionItem.vue -->
<template>
  <div class="bg-base-200 relative">
    <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
    <div class="grid grid-cols-3 gap-4 p-4">
      <!-- 左側: プレビューエリア -->
      <div class="col-span-1 bg-base-300 rounded-lg min-h-[200px]">
        <PostActionPreview :action="action" />
      </div>

      <!-- 右側: 設定エリア -->
      <div class="col-span-2 space-y-2">
        <!-- ActionType -->
        <SettingItem label="🚀 アクションタイプ" description="種類を選択します">
          <select
            class="select select-sm w-full max-w-xs"
            :value="action.actionType"
            @change="updateActionType(($event.target as HTMLSelectElement).value as PostActionType['actionType'])"
          >
            <option v-for="t in actionTypes" :key="t.type" :value="t.type">
              {{ t.label }}
            </option>
          </select>
        </SettingItem>

        <!-- 遅延秒数（全タイプ共通） -->
        <SettingItem label="⏱️ 遅延秒数" description="この秒数後に下記のアクションを実行します">
          <input
            type="number"
            v-model.number="delaySeconds"
            min="-1"
            step="0.1"
            class="input input-bordered input-sm w-32"
            placeholder="0"
          />
        </SettingItem>

        <!-- 動的コンポーネント表示 -->
        <component
          v-if="currentComponent"
          :is="currentComponent"
          v-bind="{ action: action as any, 'character-options': characterOptions }"
          @update:action="handleActionUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionSchema, PostActionType, RulesCategoryType } from '@/types/'
  import MessageSettings from './MessageSettings.vue'
  import SoundSettings from './SoundSettings.vue'
  import WordPartySettings from './WordPartySettings.vue'
  import ActionSetSettings from './ActionSetSettings.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import PostActionPreview from './PostActionPreview.vue'
  import { MessageSquare, PartyPopper, Music, MessagesSquare } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    action: PostActionType
    index: number
    characterOptions: Array<{ value: string; label: string }>
  }>()

  // Emits
  const emit = defineEmits<{
    duplicate: [index: number]
    remove: [index: number]
    'update:action': [value: PostActionType]
  }>()

  // アクションタイプの定義
  const actionTypes = [
    { type: 'message' as const, label: 'メッセージ', icon: MessageSquare },
    { type: 'sound' as const, label: 'サウンド', icon: Music },
    { type: 'wordParty' as const, label: 'WordParty', icon: PartyPopper },
    { type: 'actionSet' as const, label: 'アクションセット', icon: MessagesSquare },
  ]

  // 現在表示すべきコンポーネントの決定
  const currentComponent = computed(() => {
    const componentMap = {
      message: MessageSettings,
      sound: SoundSettings,
      wordParty: WordPartySettings,
      actionSet: ActionSetSettings,
    }

    return componentMap[props.action.actionType]
  })

  // 遅延秒数のcomputed
  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => emit('update:action', { ...props.action, delaySeconds: value }),
  })

  // アクションタイプの更新
  const updateActionType = (newType: PostActionType['actionType']) => {
    const basePayload = { ...props.action, actionType: newType }

    try {
      const newAction = PostActionSchema.parse(basePayload)
      emit('update:action', newAction)
    } catch (error) {
      console.error(`Action type change failed Zod validation for type "${newType}":`, error)
    }
  }

  // アクション更新のハンドラー
  const handleActionUpdate = (updatedAction: PostActionType) => {
    emit('update:action', updatedAction)
  }
</script>
