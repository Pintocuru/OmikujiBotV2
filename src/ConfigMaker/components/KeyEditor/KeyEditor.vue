<!-- src/ConfigMaker/components/KeyEditor/KeyEditor.vue -->
<template>
  <!-- Keyエディタボタン -->
  <button
    @click="openDialog(currentKey, category)"
    class="btn btn-sm btn-outline btn-primary tooltip tooltip-bottom min-w-fit whitespace-nowrap"
    data-tip="Keyを変更します。参照している他の設定も影響を受ける可能性があります。"
  >
    <span class="inline">📝</span>
    <span class="hidden sm:inline ml-1">Key編集</span>
  </button>

  <!-- ダイアログ -->
  <Teleport to="body">
    <div v-if="isDialogOpen" class="modal modal-open">
      <div class="modal-box bg-base-300">
        <h3 class="font-bold text-lg text-primary">{{ dialogTitle }}Key編集</h3>

        <div class="py-4">
          <SettingItem label="現在のKey">
            <div class="input input-bordered bg-neutral text-neutral-content select-all">
              {{ currentKey }}
            </div>
          </SettingItem>

          <SettingItem label="新しいKey" class="form-control mt-4">
            <input
              type="text"
              v-model="newKey"
              placeholder="新しいKeyを入力"
              class="input input-bordered focus:input-primary"
              :class="{ 'input-error': hasError }"
              @input="validateKey(newKey, category, currentKey)"
            />
            <label class="label" v-if="hasError">
              <span class="label-text-alt text-error font-bold">{{ errorMessage }}</span>
            </label>
          </SettingItem>

          <!-- キャラクター使用状況 -->
          <div v-if="category === 'characters' && characterUsage" class="mt-4">
            <div class="bg-primary text-primary-content p-4 rounded-lg">
              <div class="flex items-start">
                <span class="text-sm">
                  <span class="font-bold">📊 このキャラクターの使用状況:</span>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li v-if="characterUsage.comments.length > 0">
                      コメントイベント: <span class="font-bold">{{ characterUsage.comments.length }}箇所</span>
                    </li>
                    <li v-if="characterUsage.timers.length > 0">
                      タイマーイベント: <span class="font-bold">{{ characterUsage.timers.length }}箇所</span>
                    </li>
                    <li v-if="characterUsage.metas.length">
                      配信数値イベント: <span class="font-bold">{{ characterUsage.metas.length }}箇所</span>
                    </li>
                    <li v-if="characterUsage.comments.length === 0 && characterUsage.timers.length === 0">
                      使用されていません
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          </div>

          <!-- 警告メッセージ -->
          <div
            v-if="category === 'placeholders' || category === 'characters'"
            class="bg-secondary text-secondary-content p-4 rounded-lg mt-4"
          >
            <div class="flex items-start">
              <span class="text-2xl mr-3">⚠️</span>
              <span class="text-sm">
                <span class="font-bold">
                  Keyを変更すると、この{{
                    getItemTypeLabel(category)
                  }}を参照している他の設定も影響を受ける可能性があります。
                </span>
                <span v-if="category === 'characters'" class="block mt-2">
                  キャラクターの場合、イベント系の投稿アクションも自動的に更新されます。
                </span>
              </span>
            </div>
          </div>
        </div>

        <ModalFooterActions
          :on-cancel="closeDialog"
          :on-save="() => saveKey(currentKey, category)"
          :disabled="hasError || !newKey.trim() || newKey === currentKey"
        />
      </div></div
  ></Teleport>
</template>

<script setup lang="ts">
  import { RecordCategoryType } from '@/types'
  import { useKeyEditor } from './composables/useKeyEditor'
  import ModalFooterActions from '@config/components/parts/ModalFooterActions.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  defineProps<{
    category: RecordCategoryType
    currentKey: string
  }>()

  const {
    isDialogOpen,
    newKey,
    errorMessage,
    characterUsage,
    hasError,
    dialogTitle,
    validateKey,
    openDialog,
    closeDialog,
    saveKey,
    getItemTypeLabel,
  } = useKeyEditor()
</script>
