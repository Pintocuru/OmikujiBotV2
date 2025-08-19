<!-- src/configMaker/components/placeholders/PlaceholderModal.vue -->
<template>
  <div>
    <!-- モーダルオープンボタン -->
    <button
      @click="openModal"
      class="btn btn-sm btn-outline hover:btn-primary transition-colors"
      title="プレースホルダーの編集"
    >
      編集
    </button>

    <!-- モーダル -->
    <div v-if="isModalOpen" class="modal modal-open">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">📝 プレースホルダー設定</h3>

        <PlaceholderValuesEditor ref="editorRef" :placeholderId="placeholderId" :isModal="true" :showNameEdit="true" />

        <ModalFooterActions :on-cancel="closeModal" :on-save="saveContent" :disabled="!canSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    placeholderId: string
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // リアクティブデータ
  const isModalOpen = ref(false)
  const editorRef = ref<InstanceType<typeof PlaceholderValuesEditor> | null>(null)

  // 保存可能かどうか
  const canSave = computed(() => {
    return editorRef.value?.canSave || false
  })

  // メソッド
  const openModal = async () => {
    isModalOpen.value = true
    // 次のティックで初期化を実行
    await nextTick()
    editorRef.value?.initializeValues()
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const saveContent = () => {
    if (!editorRef.value) return

    const newValues = editorRef.value.getCurrentValues()
    if (!newValues) return

    // valuesを更新して閉じる
    omikujiStore.updateRecordProperty('placeholders', props.placeholderId, 'values', newValues)
    closeModal()
  }
</script>
