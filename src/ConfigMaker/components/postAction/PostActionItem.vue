<!-- src/configMaker/components/postAction/PostActionItem.vue -->
<template>
  <div class="bg-base-200 relative">
    <!-- ActionType選択ボタン -->
    <div class="mb-2 bg-base-300">
      <div class="menu menu-horizontal gap-4">
        <button
          class="btn btn-sm"
          :class="{ 'btn-primary': action.actionType === 'message' }"
          @click="updateActionType('message')"
        >
          💬 メッセージ
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-primary': action.actionType === 'toast' }"
          @click="updateActionType('toast')"
        >
          🍞 トースト
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-primary': action.actionType === 'wordParty' }"
          @click="updateActionType('wordParty')"
        >
          🎉 WordParty
        </button>
      </div>
      <div v-if="action.actionType === 'legacy'" class="alert alert-warning">
        <span class="text-xs">⚠️ このアクションは旧形式です。上のボタンで新形式に移行してください。</span>
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
