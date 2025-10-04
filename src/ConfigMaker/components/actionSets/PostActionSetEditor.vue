<!-- src\ConfigMaker\components\actionSets\PostActionSetEditor.vue -->
<template>
  <div v-if="selectedActionSetId">
    <div class="flex justify-end gap-2">
      <CharacterBulkChanger :category="'actionSets'" :selected-rule-id="selectedActionSetId" />

      <button @click="addPostAction" class="btn btn-primary">
        <Plus class="w-4 h-4" />
        アクションを追加
      </button>
    </div>

    <draggable v-model="postActions" item-key="id" handle=".drag-handle" animation="200">
      <template #item="{ element, index }">
        <div :key="element.id || `action-${index}`" class="draggable-item">
          <PostActionItemEditor :action="element" :index="index" @update="updatePostAction(index, $event)" />
        </div>
      </template>
    </draggable>

    <button @click="addPostAction" class="btn btn-primary w-full">
      <Plus class="w-4 h-4" />
      アクションを追加
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { PostActionSchema, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import CharacterBulkChanger from '@ConfigComponents/rules/CharacterBulkChanger.vue'
  import PostActionItemEditor from './PostActionItemEditor.vue'
  import draggable from 'vuedraggable'
  import { Plus } from 'lucide-vue-next'

  const props = defineProps<{
    selectedActionSetId: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  const postActions = computed({
    get: () => {
      if (!props.selectedActionSetId) return {}
      const record = omikujiStore.getItem('actionSets', props.selectedActionSetId)
      return record?.postActions || {}
    },
    set: (value: PostActionType[]) => {
      if (!props.selectedActionSetId) return
      omikujiStore.updateRecordProperty('actionSets', props.selectedActionSetId, 'postActions', value)
    },
  })

  const addPostAction = () => {
    const newAction = PostActionSchema.parse({})
    postActions.value = [...postActions.value, newAction]
  }

  const updatePostAction = (index: number, updated: PostActionType) => {
    const updatedList = [...postActions.value]
    updatedList[index] = updated
    postActions.value = updatedList
  }
</script>
