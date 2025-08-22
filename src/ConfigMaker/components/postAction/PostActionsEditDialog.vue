<!-- src/configMaker/components/postAction/PostActionsEditDialog.vue -->
<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-max">
      <!-- 保存・キャンセルボタン -->
      <div class="mb-4">
        <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
      </div>

      <!-- プレースホルダーリスト表示 -->
      <PlaceholderList :actions="editingActions" />

      <!-- Post編集ダイアログ -->
      <PostActionsContainer
        :editing-actions="editingActions"
        :character-options="characterOptions"
        @add-action="addAction"
        @update:editing-actions="editingActions = $event"
      />

      <!-- 保存・キャンセルボタン -->
      <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, computed, Ref } from 'vue'
  import { PostActionSchema, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RuleType } from '@/types/OmikujiData/OmikujiDataSchema'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import PlaceholderList from '@ConfigComponents/placeholders/PlaceholderList.vue'
  import PostActionsContainer from './PostActionsContainer.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  // Props
  const props = defineProps<{
    category: 'comments' | 'timers'
    selectedRuleId: string | null
    omikujiIndex: number
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // キャラクター配列を取得
  const charactersArray = computed(() => omikujiStore.getCategoryArray('characters'))

  // Refs
  const dialogRef: Ref<HTMLDialogElement | null> = ref(null)
  const editingActions: Ref<PostActionType[]> = ref([])

  // 現在のPostActionsを取得
  const currentPostActions = computed(() => {
    if (!props.selectedRuleId) return []
    const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
    return record?.omikuji?.[props.omikujiIndex]?.postActions || []
  })

  // キャラクター選択肢
  const characterOptions = computed(() => {
    return charactersArray.value.map((character) => ({
      value: character.id,
      label: character.name,
    }))
  })

  // Dialog methods
  const open = () => {
    editingActions.value = JSON.parse(JSON.stringify(currentPostActions.value))
    dialogRef.value?.showModal()
  }

  const closeDialog = () => {
    dialogRef.value?.close()
    editingActions.value = []
  }

  const saveActions = () => {
    if (props.selectedRuleId) {
      // ストアを通じて直接更新
      omikujiStore.updateOmikujiPostActions(props.category, props.selectedRuleId, props.omikujiIndex, [
        ...editingActions.value,
      ])
    }
    closeDialog()
  }

  // Action management methods
  const addAction = () => {
    const characterId = charactersArray.value[0]?.id ?? ''
    const newAction = PostActionSchema.parse({ characterKey: characterId })
    editingActions.value.push(newAction)
  }

  // Expose open method for parent component
  defineExpose({
    open,
  })
</script>
