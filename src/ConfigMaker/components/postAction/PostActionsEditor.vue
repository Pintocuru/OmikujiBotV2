<!-- src\ConfigMaker\components\postAction\PostActionsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar
      :actions="localActions"
      :category="category"
      :selected-rule-id="selectedRuleId"
      @toggleJson="toggleEditMode"
      @toggleEdit="toggleTabEditor"
    />

    <!-- PostActionsタブエディター -->
    <PostActionsTabEditor v-if="isTabEditorOpen" :actions="localActions" @update:actions="updatePostActions" />

    <!-- JSON編集モード -->
    <PostActionsEditorJson v-if="isJsonMode" v-model="localActions" @close="isJsonMode = false" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import OmikujiItemToolbar from '@/ConfigMaker/components/postAction/OmikujiItemToolbar.vue'
  import PostActionsTabEditor from '@ConfigComponents/postAction/PostActionsTabEditor.vue'
  import PostActionsEditorJson from '@ConfigComponents/postAction/PostActionsEditorJson.vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    modelValue: PostActionType[]
    category: RulesCategoryType
    selectedRuleId: string | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostActionType[]]
  }>()

  // Refs
  const isJsonMode = ref(false)
  const isTabEditorOpen = ref(false)
  const localActions = ref<PostActionType[]>([...props.modelValue])

  // localActionsの変更を親に伝播
  watch(
    localActions,
    (newValue) => {
      emit('update:modelValue', newValue)
    },
    { deep: true }
  )

  // 親のmodelValueが変更されたらlocalActionsも更新
  watch(
    () => props.modelValue,
    (newValue) => {
      localActions.value = [...newValue]
    },
    { deep: true }
  )

  // Methods
  const toggleTabEditor = () => {
    isTabEditorOpen.value = !isTabEditorOpen.value
    // JSONモードが開いていたら閉じる
    if (isTabEditorOpen.value) isJsonMode.value = false
  }

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
    // タブエディターが開いていたら閉じる
    if (isJsonMode.value) isTabEditorOpen.value = false
  }

  // PostActionsの更新
  const updatePostActions = (newActions: PostActionType[]) => {
    localActions.value = newActions
  }
</script>
