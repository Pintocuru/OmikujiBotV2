<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionEditModal.vue -->
<template>
  <BaseEditDialog ref="baseDialog" title="エモーション画像の編集" icon="Info" @save="handleSave">
    <div v-if="selectedEmotionKey && draftItem" class="space-y-2">
      <ImageSettingsInfo />
      <!-- ヘッダー: 表示名・削除・リセット -->
      <EmotionImageItem
        :emotion-key="selectedEmotionKey"
        :label="draftItem.label ?? ''"
        :is-default-warning="selectedEmotionKey === 'default' && !props.isDefaultFilled"
        @update:label="(v) => updateLabel(selectedEmotionKey!, v)"
        @remove="handleDraftRemove"
      />

      <!-- 2カラムグリッド: レイヤー編集 / アニメーション編集 -->
      <div class="grid grid-cols-2 gap-4">
        <EmotionLayerEditor
          :src="draftItem.src"
          :emotion-key="selectedEmotionKey"
          :selected-item-key="selectedItemKey ?? 'default'"
          @update:src="(v) => updateSrc(selectedEmotionKey!, v)"
        />
        <EmotionAnimationEditor
          :emotion-key="selectedEmotionKey"
          :src="draftItem.src"
          :animation="draftItem.animation"
          @update:animation="(v) => updateAnimation(selectedEmotionKey!, v)"
        />
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-32 text-base-content/40 text-sm">
      感情が選択されていません
    </div>
  </BaseEditDialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import type { CharacterImageType } from '@/types/'
  import EmotionImageItem from './EmotionImageItem.vue'
  import EmotionLayerEditor from './EmotionLayerEditor.vue'
  import EmotionAnimationEditor from './EmotionAnimationEditor.vue'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import BaseEditDialog from '@config/components/common/BaseDialog/BaseEditDialog.vue'
  import { useEmotionDraft } from './composables/useEmotionDraft'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const props = defineProps<{
    modelValue: CharacterImageType
    selectedItemKey: string | null
    isDefaultFilled: boolean
    initialEmotionKey?: string | null
  }>()

  const emit = defineEmits<{
    update: [value: CharacterImageType]
    remove: [key: string]
  }>()

  // ── ダイアログ ref & 選択中キー ──────────────────────────────────────────
  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const selectedEmotionKey = ref<string | null>(null)

  // ── Draft 管理 ────────────────────────────────────────────────────────────
  const { draftValue, initDraft, updateSrc, updateLabel, updateAnimation } = useEmotionDraft(() => props.modelValue)

  const draftItem = computed(() =>
    selectedEmotionKey.value ? (draftValue.value[selectedEmotionKey.value] ?? null) : null
  )

  // ── Draft ハンドラ ─────────────────────────────────────────────────────────

  const handleDraftRemove = async () => {
    if (!selectedEmotionKey.value) return

    const result = await swalModal.confirmDelete({
      text: `「${draftItem.value?.label ?? selectedEmotionKey.value}」を削除しますか？`,
      target: baseDialog.value?.$el ?? 'body',
    })
    if (!result.isConfirmed) return

    // 削除だけ即emitして閉じる
    emit('remove', selectedEmotionKey.value)
    selectedEmotionKey.value = null
    closeModal()
  }

  // ── 保存: diff を emit ────────────────────────────────────────────────────
  const handleSave = () => {
    const finalDraft = { ...draftValue.value }
    emit('update', finalDraft)
  }

  // ── 公開 API ───────────────────────────────────────────────────────────────
  const showModal = (key?: string) => {
    initDraft()
    if (key) {
      selectedEmotionKey.value = key
    } else if (props.initialEmotionKey) {
      selectedEmotionKey.value = props.initialEmotionKey
    }
    baseDialog.value?.showModal()
  }

  const closeModal = () => baseDialog.value?.close()

  defineExpose({ showModal, closeModal })

  // ── ウォッチャー ───────────────────────────────────────────────────────────
  watch(
    () => props.initialEmotionKey,
    (key) => {
      if (key) selectedEmotionKey.value = key
    }
  )
</script>
