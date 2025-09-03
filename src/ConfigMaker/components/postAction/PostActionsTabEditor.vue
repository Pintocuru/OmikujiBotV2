<!-- src/configMaker/components/postAction/PostActionsTabEditor.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs tabs-bordered">
    <a
      v-for="(action, index) in sortedActions"
      :key="`action-${index}`"
      class="tab tab-sm"
      :class="{ 'tab-active': activeTab === index }"
      @click="setActiveTab(index)"
    >
      <span class="flex items-center gap-1">
        <span class="text-xs">{{ action.delaySeconds }}s</span>
        <span v-if="action.messageContent" class="badge badge-xs badge-primary">💬</span>
        <span v-if="action.messageToast" class="badge badge-xs badge-secondary">🍞</span>
      </span>
    </a>

    <!-- 新規追加タブ -->
    <a class="tab tab-sm" @click="addNewAction">
      <span class="text-lg">+</span>
    </a>
  </div>

  <!-- タブコンテンツ -->
  <div v-if="sortedActions.length > 0" class="bg-base-100 border border-base-300 border-t-0 p-4">
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
  <div v-else class="bg-base-100 border border-base-300 border-t-0 p-8 text-center text-base-content/60">
    <p class="mb-4">PostActionがありません</p>
    <button @click="addNewAction" class="btn btn-primary btn-sm">最初のアクションを追加</button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import PostActionItem from './PostActionItem.vue'
  import { useCharacterEmotions } from '@ConfigComponents/parts/useCharacterEmotions'

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

  // delaySecondsでソートされたアクション
  const sortedActions = computed(() => {
    return [...props.actions].sort((a, b) => a.delaySeconds - b.delaySeconds)
  })

  // 現在選択されているアクション
  const currentAction = computed(() => {
    return sortedActions.value[activeTab.value] || null
  })

  // ソートされた配列での元のインデックスを取得
  const getOriginalIndex = (sortedIndex: number): number => {
    const sortedAction = sortedActions.value[sortedIndex]
    return props.actions.findIndex((action) => action === sortedAction)
  }

  // タブの切り替え
  const setActiveTab = (index: number) => {
    if (index >= 0 && index < sortedActions.value.length) {
      activeTab.value = index
    }
  }

  // アクションの更新
  const updateCurrentAction = (updatedAction: PostActionType) => {
    const originalIndex = getOriginalIndex(activeTab.value)
    if (originalIndex !== -1) {
      const newActions = [...props.actions]
      newActions[originalIndex] = updatedAction
      emit('update:actions', newActions)
    }
  }

  // 新しいアクションの追加
  const addNewAction = () => {
    const newAction: PostActionType = {
      characterKey: characterOptions.value[0]?.value || '',
      iconKey: 'default',
      messageContent: '',
      delaySeconds: 0,
      wordParty: '',
    }

    const newActions = [...props.actions, newAction]
    emit('update:actions', newActions)

    // 新しく追加されたアクションのタブに切り替え
    // ソート後の位置を計算
    setTimeout(() => {
      const sortedNewActions = [...newActions].sort((a, b) => a.delaySeconds - b.delaySeconds)
      const newIndex = sortedNewActions.findIndex((action) => action === newAction)
      setActiveTab(newIndex)
    })
  }

  // アクションの複製
  const duplicateAction = (sortedIndex: number) => {
    const originalIndex = getOriginalIndex(sortedIndex)
    if (originalIndex !== -1) {
      const actionToDuplicate = { ...props.actions[originalIndex] }
      const newActions = [...props.actions, actionToDuplicate]
      emit('update:actions', newActions)

      // 複製されたアクションのタブに切り替え
      setTimeout(() => {
        const sortedNewActions = [...newActions].sort((a, b) => a.delaySeconds - b.delaySeconds)
        const newIndex = sortedNewActions.findIndex((action) => action === actionToDuplicate)
        setActiveTab(newIndex)
      })
    }
  }

  // アクションの削除
  const removeAction = (sortedIndex: number) => {
    const originalIndex = getOriginalIndex(sortedIndex)
    if (originalIndex !== -1) {
      const newActions = props.actions.filter((_, index) => index !== originalIndex)
      emit('update:actions', newActions)

      // アクティブタブの調整
      if (activeTab.value >= newActions.length) {
        activeTab.value = Math.max(0, newActions.length - 1)
      }
    }
  }

  // アクション数が変更された場合のタブ調整
  watch(
    () => sortedActions.value.length,
    (newLength) => {
      if (newLength === 0) {
        activeTab.value = 0
      } else if (activeTab.value >= newLength) {
        activeTab.value = newLength - 1
      }
    },
    { immediate: true }
  )

  // アクションが空でない場合、最初のタブをアクティブにする
  watch(
    () => sortedActions.value,
    (newSortedActions) => {
      if (newSortedActions.length > 0 && activeTab.value >= newSortedActions.length) {
        activeTab.value = 0
      }
    },
    { immediate: true }
  )
</script>
