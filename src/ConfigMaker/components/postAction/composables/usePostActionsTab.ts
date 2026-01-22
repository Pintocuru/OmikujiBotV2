// src/configMaker/composables/usePostActionsTab.ts
import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { PostActionMessageSchema, PostActionMessageType, PostActionType } from '@/types/OmikujiData/'
import { useCharacterManager } from '@/ConfigMaker/scripts/CharacterManager/useCharacterManager'

export function usePostActionsTab(
  actions: Ref<PostActionType[]>,
  emit: (event: 'update:actions', actions: PostActionType[]) => void
) {
  const { characterArray } = useCharacterManager()

  // アクティブなタブのインデックス（-1はプレースホルダータブ）
  const activeTab = ref(0)

  // 現在選択されているアクション
  const currentAction = computed(() => {
    return actions.value[activeTab.value] || null
  })

  // タブの切り替え
  const setActiveTab = (index: number) => {
    // 同じタブをクリックで閉じる
    if (index === activeTab.value) {
      activeTab.value = -2
    } else if (index === -1) {
      // プレースホルダータブ
      activeTab.value = -1
    } else if (index >= 0 && index < actions.value.length) {
      // PostActionタブ
      activeTab.value = index
    }
  }

  // アクションの更新
  const updateCurrentAction = (updatedAction: PostActionType) => {
    const newActions = [...actions.value]
    newActions[activeTab.value] = updatedAction
    emit('update:actions', newActions)
  }

  // 新しいアクションの追加
  const addNewAction = () => {
    const newAction: PostActionMessageType = PostActionMessageSchema.parse({
      characterKey: characterArray.value[0]?.key ?? null,
      delaySeconds: actions.value.length > 0 ? Math.max(...actions.value.map((a) => a.delaySeconds)) + 1 : 0,
    })

    const newActions = [...actions.value, newAction]
    emit('update:actions', newActions)

    // 新しく追加されたアクションのタブに切り替え
    activeTab.value = newActions.length - 1
  }

  // アクションの複製
  const duplicateAction = (index: number) => {
    if (index >= 0 && index < actions.value.length) {
      const actionToDuplicate = { ...actions.value[index] }
      // 複製時は遅延時間を少し後ろにずらす
      actionToDuplicate.delaySeconds = actionToDuplicate.delaySeconds + 0.5

      // 複製されたアクションを元のアクションの直後に挿入
      const newActions = [...actions.value]
      newActions.splice(index + 1, 0, actionToDuplicate)
      emit('update:actions', newActions)

      // 複製されたアクションのタブに切り替え
      activeTab.value = index + 1
    }
  }

  // アクションの削除
  const removeAction = (index: number) => {
    if (index >= 0 && index < actions.value.length) {
      const newActions = actions.value.filter((_, i) => i !== index)
      emit('update:actions', newActions)

      // アクティブタブの調整
      if (activeTab.value === index) {
        // 削除されたタブが選択されていた場合
        if (newActions.length === 0) {
          activeTab.value = -1 // プレースホルダータブに戻る
        } else if (index >= newActions.length) {
          activeTab.value = newActions.length - 1
        }
        // 削除されたタブより前のタブが選択されていた場合は何もしない
      } else if (activeTab.value > index) {
        // 削除されたタブより後ろのタブが選択されていた場合、インデックスを調整
        activeTab.value = activeTab.value - 1
      }
    }
  }

  // アクション数が変更された場合のタブ調整
  watch(
    () => actions.value.length,
    (newLength, oldLength) => {
      if (newLength === 0 && activeTab.value >= 0) {
        activeTab.value = -1 // プレースホルダータブに戻る
      } else if (activeTab.value >= newLength && newLength > 0) {
        activeTab.value = newLength - 1
      } else if (newLength > 0 && activeTab.value === -1 && oldLength === 0) {
        // 初回アクション追加時は最初のアクションタブを選択
        activeTab.value = 0
      }
    },
    { immediate: true }
  )

  return {
    activeTab,
    currentAction,
    setActiveTab,
    updateCurrentAction,
    addNewAction,
    duplicateAction,
    removeAction,
  }
}
