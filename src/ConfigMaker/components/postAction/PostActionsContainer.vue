<!-- src/configMaker/components/postAction/PostActionsContainer.vue -->
<template>
  <div class="card bg-base-300 mt-4">
    <!-- タイトルバー -->
    <div class="flex justify-between items-center bg-primary text-white rounded-t px-4 py-2">
      <h3 class="text-lg font-semibold">Post Actions 編集</h3>
      <div class="flex gap-2">
        <button @click="emit('add-action')" class="btn btn-sm btn-secondary">
          <Plus class="w-4 h-4" />
          追加
        </button>
      </div>
    </div>

    <!-- 本体 -->
    <div class="card-body p-2">
      <div v-if="editingActions.length > 0" class="space-y-4">
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

      <!-- アクションが0のとき -->
      <div v-else class="text-center text-gray-500 py-8">
        Post Actions がありません。「➕ 追加」ボタンで追加してください。
      </div>

      <button @click="emit('add-action')" class="btn btn-primary w-full mt-4">
        <Plus class="w-4 h-4" />
        アクションの追加
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { PostActionType } from '@/types/'
  import PostActionItem from './PostActionItem.vue'
  import { Plus } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    editingActions: PostActionType[]
    characterOptions: Array<{ value: string; label: string }>
  }>()

  // Emits
  const emit = defineEmits<{
    'add-action': []
    'update:editingActions': [actions: PostActionType[]]
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
    const newActions = [...props.editingActions]
    newActions.splice(index, 1)
    emit('update:editingActions', newActions)

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
    const newActions = [...props.editingActions]
    const original = newActions[index]
    const duplicated = JSON.parse(JSON.stringify(original))
    newActions.splice(index + 1, 0, duplicated)

    emit('update:editingActions', newActions)

    const newModes: Record<number, 'select' | 'manual'> = {}
    Object.keys(wordPartyInputModes).forEach((key) => {
      const keyNum = Number(key)
      if (keyNum <= index) {
        newModes[keyNum] = wordPartyInputModes[keyNum]
      } else {
        newModes[keyNum + 1] = wordPartyInputModes[keyNum]
      }
    })

    newModes[index + 1] = wordPartyInputModes[index] || 'select'

    Object.keys(wordPartyInputModes).forEach((key) => {
      delete wordPartyInputModes[Number(key)]
    })
    Object.assign(wordPartyInputModes, newModes)
  }
</script>
