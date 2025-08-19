<!-- src/configMaker/components/postAction/PostActionsContainer.vue -->
<template>
  <div class="card bg-base-300 mt-4">
    <!-- タイトルバー -->
    <PostActionsHeader @add-action="$emit('add-action')" @sort-by-delay="$emit('sort-by-delay')" />

    <!-- 本体 -->
    <div class="card-body p-2">
      <div v-if="editingActions.length === 0" class="text-center text-gray-500 py-8">
        Post Actions がありません。「➕ 追加」ボタンで追加してください。
      </div>

      <div v-else class="space-y-4">
        <PostActionItem
          v-for="(postAction, index) in editingActions"
          :key="index"
          :action="postAction"
          :index="index"
          :character-options="characterOptions"
          @duplicate="duplicateAction"
          @remove="removeAction"
          @update:action="updateAction(index, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue' // `computed`をインポート
  import { PostActionType } from '@/types/'
  import PostActionsHeader from './PostActionsHeader.vue'
  import PostActionItem from './PostActionItem.vue'

  // Props
  const props = defineProps<{
    editingActions: PostActionType[]
    characterOptions: Array<{ value: string; label: string }>
  }>()

  // Emits
  const emit = defineEmits<{
    'add-action': []
    'sort-by-delay': []
    'update:editingActions': [actions: PostActionType[]] // `update:editingActions` イベントを追加
  }>()

  // WordParty入力モード管理
  const wordPartyInputModes = reactive<Record<number, 'select' | 'manual'>>({})

  const updateAction = (index: number, updatedAction: PostActionType) => {
    const newActions = [...props.editingActions]
    newActions[index] = updatedAction
    emit('update:editingActions', newActions)
  }

  // Action management methods
  const removeAction = (index: number) => {
    // 新しい配列を生成して、要素を削除する
    const newActions = [...props.editingActions]
    newActions.splice(index, 1)

    // 親コンポーネントに新しい配列をemitして更新を依頼する
    emit('update:editingActions', newActions)

    // WordParty入力モードも削除し、インデックスを再調整
    const newModes: Record<number, 'select' | 'manual'> = {}
    Object.keys(wordPartyInputModes).forEach((key) => {
      const keyNum = Number(key)
      if (keyNum < index) {
        newModes[keyNum] = wordPartyInputModes[keyNum]
      } else if (keyNum > index) {
        newModes[keyNum - 1] = wordPartyInputModes[keyNum]
      }
    })

    Object.keys(wordPartyInputModes).forEach((key) => {
      delete wordPartyInputModes[Number(key)]
    })
    Object.assign(wordPartyInputModes, newModes)
  }

  const duplicateAction = (index: number) => {
    // 新しい配列を生成して、要素を複製する
    const newActions = [...props.editingActions]
    const original = newActions[index]
    const duplicated = JSON.parse(JSON.stringify(original))
    newActions.splice(index + 1, 0, duplicated)

    // 親コンポーネントに新しい配列をemitして更新を依頼する
    emit('update:editingActions', newActions)

    // WordParty入力モードも複製し、インデックスを再調整
    const newModes: Record<number, 'select' | 'manual'> = {}
    Object.keys(wordPartyInputModes).forEach((key) => {
      const keyNum = Number(key)
      if (keyNum <= index) {
        newModes[keyNum] = wordPartyInputModes[keyNum]
      } else {
        newModes[keyNum + 1] = wordPartyInputModes[keyNum]
      }
    })

    // 複製されたアクションの入力モードを設定
    newModes[index + 1] = wordPartyInputModes[index] || 'select'

    Object.keys(wordPartyInputModes).forEach((key) => {
      delete wordPartyInputModes[Number(key)]
    })
    Object.assign(wordPartyInputModes, newModes)
  }
</script>
