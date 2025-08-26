<!-- src/configMaker/components/postAction/PostActionsContainer.vue -->
<template>
  <SectionCard variant="primary">
    <template #header>
      <div>PostActions 編集</div>
    </template>

    <template #body>
      <!-- 追加ボタン -->
      <div class="flex justify-between rounded-t">
        <div></div>
        <div>
          <button @click="emit('add-action')" class="btn btn-sm btn-secondary">
            <Plus class="w-4 h-4" />
            追加
          </button>
        </div>
      </div>

      <!-- 本体 -->
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
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { PostActionType } from '@/types/'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
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
