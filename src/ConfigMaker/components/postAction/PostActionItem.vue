<!-- src/configMaker/components/postAction/PostActionItem.vue -->
<template>
  <div class="p-4 bg-base-200 relative">
    <!-- 右下固定の操作ボタン -->
    <div class="absolute top-2 right-2">
      <MenuDropdown @duplicate="$emit('duplicate', index)" @delete="$emit('remove', index)" />
    </div>

    <!-- ActionType選択ボタン -->
    <div class="mb-4">
      <label class="label py-0">
        <span class="label-text text-sm font-medium">📝 アクション種別</span>
      </label>
      <div class="btn-group">
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
      <div v-if="action.actionType === 'legacy'" class="alert alert-warning mt-2">
        <span class="text-xs">⚠️ このアクションは旧形式です。上のボタンで新形式に移行してください。</span>
      </div>
    </div>

    <!-- 遅延秒数（全タイプ共通） -->
    <div class="form-control mb-4">
      <label class="label py-0">
        <span class="label-text text-sm">⏱️ 遅延秒数</span>
      </label>
      <input
        type="number"
        v-model.number="delaySeconds"
        min="-1"
        step="0.1"
        class="input input-bordered input-sm w-32"
        placeholder="0"
      />
    </div>

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
      <div class="alert alert-info">
        <span class="text-sm">🔄 レガシー形式: 新しい形式への移行をお勧めします</span>
      </div>

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
