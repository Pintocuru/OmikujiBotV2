<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionEditModal.vue -->
<template>
  <BaseEditDialog ref="baseDialog" title="感情画像の編集" icon="Info" @save="handleSave" @cancel="handleCancel">
    <!-- 左サイドバー: 将来的な感情一覧などを置く場所として確保 -->
    <!-- 現在は単一感情の編集のみなので非表示 -->

    <!-- メインコンテンツ -->
    <div class="p-4">
      <template v-if="selectedEmotionKey && draftItem">
        <EmotionImageItem
          :emotion-key="selectedEmotionKey"
          :emotion-label="draftItem.label || selectedEmotionKey"
          :emotion-name="draftItem.label"
          :current-value="draftItem.src"
          :selected-item-key="props.selectedItemKey"
          :is-default-filled="props.isDefaultFilled"
          @update="handleDraftUpdate"
          @update-name="handleDraftUpdateName"
          @reset="handleDraftReset"
          @remove="handleDraftRemove"
        />
        {{ draftItem }}
      </template>
      <div v-else class="flex items-center justify-center h-32 text-base-content/40 text-sm">
        感情が選択されていません
      </div>
    </div>
  </BaseEditDialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import type { CharacterImageType } from '@/types/'
  import EmotionImageItem from './EmotionImageItem.vue'
  import BaseEditDialog from '@config/components/common/BaseDialog/BaseEditDialog.vue'

  const props = defineProps<{
    modelValue: CharacterImageType
    selectedItemKey: string | null
    isDefaultFilled: boolean
    initialEmotionKey?: string | null
  }>()

  // TODO: animation のemitがないために更新されない
  const emit = defineEmits<{
    update: [key: string, src: string[]]
    updateName: [key: string, name: string]
    reset: [key: string]
    remove: [key: string]
    add: [key: string]
  }>()

  // ──────────────────────────────────────────
  // ダイアログ ref & 選択中キー
  // ──────────────────────────────────────────
  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const selectedEmotionKey = ref<string | null>(null)

  // ──────────────────────────────────────────
  // Draft: ダイアログ内編集は draft にのみ反映
  // ──────────────────────────────────────────
  /** props.modelValue のディープコピーを保持 */
  const draftValue = ref<CharacterImageType>({})

  /** 選択中感情の draft エントリ */
  const draftItem = computed(() => (selectedEmotionKey.value ? draftValue.value[selectedEmotionKey.value] : null))

  /** ダイアログを開くたびに draft を props から初期化 */
  const initDraft = () => {
    draftValue.value = JSON.parse(JSON.stringify(props.modelValue))
  }

  // ──────────────────────────────────────────
  // Draft 操作ハンドラ (emit は保存時まで保留)
  // ──────────────────────────────────────────
  const handleDraftUpdate = (key: string, src: string[]) => {
    if (!draftValue.value[key]) return
    draftValue.value[key] = { ...draftValue.value[key], src }
  }

  const handleDraftUpdateName = (key: string, name: string) => {
    if (!draftValue.value[key]) return
    draftValue.value[key] = { ...draftValue.value[key], label: name }
  }

  const handleDraftReset = (key: string) => {
    emit('reset', key)
  }

  const handleDraftRemove = (key: string) => {
    if (selectedEmotionKey.value === key) selectedEmotionKey.value = null
    delete draftValue.value[key]
  }

  // ──────────────────────────────────────────
  // 保存 / キャンセル
  // ──────────────────────────────────────────

  /**
   * draft と props.modelValue の差分を emit する。
   * - src が変わったエントリは emit('update')
   * - label が変わったエントリは emit('update-name')
   * - draft に存在しないエントリは emit('remove')
   */
  const handleSave = () => {
    const original = props.modelValue

    // 削除されたキーを検出
    for (const key of Object.keys(original)) {
      if (!(key in draftValue.value)) {
        emit('remove', key)
      }
    }

    // 変更・追加されたキーを検出
    for (const [key, item] of Object.entries(draftValue.value)) {
      const orig = original[key]

      // src の変更
      if (!orig || JSON.stringify(orig.src) !== JSON.stringify(item.src)) {
        emit('update', key, item.src)
      }

      // label の変更
      if (!orig || orig.label !== item.label) {
        emit('updateName', key, item.label ?? '')
      }
    }
  }

  /** キャンセル: draft を破棄するだけ（closeは BaseEditDialog 側が行う） */
  const handleCancel = () => {
    // 何もしない。次回 showModal() 時に initDraft() が走る。
  }

  // ──────────────────────────────────────────
  // 公開 API
  // ──────────────────────────────────────────
  const showModal = () => {
    initDraft()
    if (props.initialEmotionKey) selectedEmotionKey.value = props.initialEmotionKey
    baseDialog.value?.showModal()
  }

  const closeModal = () => baseDialog.value?.close()

  defineExpose({ showModal, closeModal })

  // 親から initialEmotionKey が変わった場合も追従
  watch(
    () => props.initialEmotionKey,
    (key) => {
      if (key) selectedEmotionKey.value = key
    }
  )

  watch(
    () => props.modelValue,
    (val) => {
      // ダイアログ開いている間もリセット操作を反映
      if (selectedEmotionKey.value && val[selectedEmotionKey.value]) {
        draftValue.value[selectedEmotionKey.value] = JSON.parse(JSON.stringify(val[selectedEmotionKey.value]))
      }
    },
    { deep: true }
  )
</script>
