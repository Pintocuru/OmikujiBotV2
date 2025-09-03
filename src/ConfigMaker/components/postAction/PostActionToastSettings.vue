<!-- src/configMaker/components/postAction/PostActionToastSettings.vue -->
<template>
  <div class="space-y-4">
    <h3 class="text-sm font-medium flex items-center gap-2">
      <span>🍞 トースト設定</span>
    </h3>

    <!-- キャラクター選択 -->
    <div class="form-control">
      <label class="label py-0">
        <span class="label-text text-sm">👤 キャラクター</span>
      </label>
      <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
        <option v-for="char in characterOptions" :key="char.value" :value="char.value">
          {{ char.label }}
        </option>
      </select>
    </div>

    <!-- トーストメッセージ -->
    <div class="form-control">
      <label class="label py-0">
        <span class="label-text text-sm">📝 トーストメッセージ</span>
      </label>
      <input
        type="text"
        v-model="messageToast"
        class="input input-bordered input-sm"
        placeholder="トーストとして表示するメッセージを入力してください"
      />
    </div>

    <!-- オプション設定 -->
    <div class="divider text-xs">オプション設定</div>

    <!-- サウンド -->
    <div class="form-control">
      <label class="label py-0">
        <span class="label-text text-sm">🔊 サウンド</span>
      </label>
      <input
        type="text"
        v-model="sound"
        class="input input-bordered input-sm"
        placeholder="サウンドファイル名（オプション）"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'

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

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })
</script>
