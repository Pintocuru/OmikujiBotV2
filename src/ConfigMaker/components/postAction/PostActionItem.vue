<!-- src/configMaker/components/postAction/PostActionItem.vue -->
<template>
  <div class="bg-base-200 relative">
    <!-- ActionType選択ボタン -->
    <div class="mb-2 bg-base-300 flex justify-center py-2">
      <div class="flex gap-4">
        <!-- メッセージ -->
        <button
          class="btn btn-sm tooltip flex items-center gap-1"
          data-tip="メッセージ"
          :class="{ 'btn-primary': action.actionType === 'message' }"
          @click="updateActionType('message')"
        >
          <MessageSquare class="w-4 h-4" />
          <span>メッセージ</span>
        </button>

        <!-- トースト -->
        <button
          class="btn btn-sm tooltip flex items-center gap-1"
          data-tip="トースト"
          :class="{ 'btn-primary': action.actionType === 'toast' }"
          @click="updateActionType('toast')"
        >
          <Bell class="w-4 h-4" />
          <span>トースト</span>
        </button>

        <!-- WordParty -->
        <button
          class="btn btn-sm tooltip flex items-center gap-1"
          data-tip="WordParty"
          :class="{ 'btn-primary': action.actionType === 'wordParty' }"
          @click="updateActionType('wordParty')"
        >
          <PartyPopper class="w-4 h-4" />
          <span>WordParty</span>
        </button>
      </div>
    </div>

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

    <!-- メッセージタイプの設定 -->
    <PostActionMessageSettings
      v-if="action.actionType === 'message'"
      :action="action"
      :character-options="characterOptions"
      @update:action="handleActionUpdate"
    />

    <!-- トーストタイプの設定 -->
    <PostActionToastSettings
      v-else-if="action.actionType === 'toast'"
      :action="action"
      :character-options="characterOptions"
      @update:action="handleActionUpdate"
    />

    <!-- WordPartyタイプの設定 -->
    <PostActionWordPartySettings
      v-else-if="action.actionType === 'wordParty'"
      :action="action"
      @update:action="handleActionUpdate"
    />

    <!-- レガシータイプ（既存の設定を表示） -->
    <div v-else-if="action.actionType === 'legacy'" class="space-y-4">
      <!-- レガシー用の基本設定 -->
      <PostActionBasicSettings
        :action="action"
        :character-options="characterOptions"
        @update:action="handleActionUpdate"
      />

      <!-- レガシー用のメッセージフィールド -->
      <PostActionMessageFields :action="action" :index="index" @update:action="handleActionUpdate" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue'
  import PostActionBasicSettings from './PostActionBasicSettings.vue'
  import PostActionMessageFields from './PostActionMessageFields.vue'
  import PostActionMessageSettings from './PostActionMessageSettings.vue'
  import PostActionToastSettings from './PostActionToastSettings.vue'
  import PostActionWordPartySettings from './PostActionWordPartySettings.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { MessageSquare, Bell, PartyPopper } from 'lucide-vue-next'

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

  // 遅延秒数のcomputed
  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => {
      emit('update:action', { ...props.action, delaySeconds: value })
    },
  })

  // アクションタイプの更新
  const updateActionType = (newType: 'message' | 'toast' | 'wordParty') => {
    const updatedAction: PostActionType = {
      ...props.action,
      actionType: newType,
    }

    emit('update:action', updatedAction)
  }

  // アクション更新のハンドラー
  const handleActionUpdate = (updatedAction: PostActionType) => {
    emit('update:action', updatedAction)
  }
</script>
