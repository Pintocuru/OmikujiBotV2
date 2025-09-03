<!-- src/configMaker/components/postAction/PostActionsTabEditor.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs">
    <button
      v-for="(action, index) in props.actions"
      :key="`action-${index}`"
      class="tab tab-sm"
      :class="{ 'tab-active bg-base-200': activeTab === index }"
      @click="setActiveTab(index)"
    >
      <span class="flex gap-2">
        <span class="badge badge-primary badge-sm">{{ index + 1 }}</span>
        <span class="badge badge-accent badge-sm rounded"> {{ action.delaySeconds }}s </span>
        <span v-if="action.actionType === 'legacy'" class="badge badge-sm badge-error">!</span>
      </span>
    </button>

    <button class="tab tab-sm" @click="addNewAction">
      <span class="text-lg">+</span>
    </button>
  </div>

  <!-- タブコンテンツ -->
  <div v-if="props.actions.length > 0">
    <PostActionItem
      :action="currentAction"
      :index="activeTab"
      :character-options="characterOptions"
      @update:action="updateCurrentAction"
      @duplicate="duplicateAction"
      @remove="removeAction"
    />
  </div>

  <!-- アクションが空の場合 -->
  <div v-else>
    <NoParamsCard message="PostActionがありません" />
    <button @click="addNewAction" class="btn btn-primary btn-sm">最初のアクションを追加</button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import PostActionItem from './PostActionItem.vue'
  import { useCharacterEmotions } from '@ConfigComponents/parts/useCharacterEmotions'
  import NoParamsCard from '@ConfigComponents/parts/NoParamsCard.vue'

  const props = defineProps<{
    actions: PostActionType[]
    category: string
    selectedRuleId: string | null
    omikujiIndex: number
  }>()

  const emit = defineEmits<{
    'update:actions': [actions: PostActionType[]]
  }>()

  // キャラクターオプションの取得
  const { charactersMap } = useCharacterEmotions()
  const characterOptions = computed(() => {
    return Object.entries(charactersMap.value).map(([key, char]) => ({
      value: key,
      label: char.name,
    }))
  })

  // アクティブなタブのインデックス
  const activeTab = ref(0)

  // 現在選択されているアクション
  const currentAction = computed(() => {
    return props.actions[activeTab.value] || null
  })

  // タブの切り替え
  const setActiveTab = (index: number) => {
    if (index >= 0 && index < props.actions.length) {
      activeTab.value = index
    }
  }

  // アクションの更新
  const updateCurrentAction = (updatedAction: PostActionType) => {
    const newActions = [...props.actions]
    newActions[activeTab.value] = updatedAction
    emit('update:actions', newActions)
  }

  // 新しいアクションの追加
  const addNewAction = () => {
    const newAction: PostActionType = {
      actionType: 'message',
      characterKey: characterOptions.value[0]?.value || '',
      iconKey: 'default',
      messageContent: '',
      delaySeconds: props.actions.length > 0 ? Math.max(...props.actions.map((a) => a.delaySeconds)) + 1 : 0,
      wordParty: '',
    }

    const newActions = [...props.actions, newAction]
    emit('update:actions', newActions)

    // 新しく追加されたアクションのタブに切り替え
    activeTab.value = newActions.length - 1
  }

  // アクションの複製
  const duplicateAction = (index: number) => {
    if (index >= 0 && index < props.actions.length) {
      const actionToDuplicate = { ...props.actions[index] }
      // 複製時は遅延時間を少し後ろにずらす
      actionToDuplicate.delaySeconds = actionToDuplicate.delaySeconds + 0.5
      const newActions = [...props.actions, actionToDuplicate]
      emit('update:actions', newActions)

      // 複製されたアクションのタブに切り替え
      activeTab.value = newActions.length - 1
    }
  }

  // アクションの削除
  const removeAction = (index: number) => {
    if (index >= 0 && index < props.actions.length) {
      const newActions = props.actions.filter((_, i) => i !== index)
      emit('update:actions', newActions)

      // アクティブタブの調整
      if (activeTab.value >= newActions.length) {
        activeTab.value = Math.max(0, newActions.length - 1)
      }
    }
  }

  // アクション数が変更された場合のタブ調整
  watch(
    () => props.actions.length,
    (newLength) => {
      if (newLength === 0) {
        activeTab.value = -1 // プレースホルダータブに戻る
      } else if (activeTab.value >= newLength) {
        activeTab.value = newLength - 1
      }
    },
    { immediate: true }
  )
</script>
