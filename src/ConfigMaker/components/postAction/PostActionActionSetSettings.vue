<!-- src\ConfigMaker\components\postAction\PostActionActionSetSettings.vue -->
<template>
  <SettingItem label="📦 アクションセット" description="定義されたセットを呼び出して、演出をまとめて実行します">
    <div class="space-y-2">
      <select
        v-model="actionSetKey"
        class="select select-bordered select-sm w-full"
        :class="{ 'select-error': hasCircularReference }"
      >
        <option value="">-- 選択してください --</option>
        <option v-for="option in availableActionSets" :key="option.key" :value="option.key" :disabled="option.disabled">
          {{ option.name }} {{ option.disabled ? '(循環参照)' : '' }}
        </option>
      </select>

      <div v-if="hasCircularReference" class="alert alert-error py-2 text-sm">
        <XCircle class="w-5 h-5 text-current" />
        <span>⚠️ 循環参照が検出されました: {{ circularReferencePath }}</span>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { XCircle } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostActionType
    currentKey?: string // 現在編集中のアクションセットのキー
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionType]
  }>()

  // OmikujiDataをinject（親コンポーネントでprovideされている前提）
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const actionSetKey = computed({
    get: () => props.action.actionSetKey || '',
    set: (value) => updateAction({ actionSetKey: value }),
  })

  /**
   * 循環参照をチェックする関数
   */
  const checkCircularReference = (targetKey: string, visited: Set<string> = new Set()): string[] | null => {
    if (!data.value?.actionSets) return null
    if (!targetKey) return null

    // 自分自身を参照している場合
    if (targetKey === props.currentKey) {
      return [props.currentKey || '', targetKey]
    }

    // 既に訪問済みなら循環参照
    if (visited.has(targetKey)) {
      return [targetKey]
    }

    const actionSet = data.value.actionSets[targetKey]
    if (!actionSet?.postActions) return null

    visited.add(targetKey)

    // このアクションセット内のすべてのアクションをチェック
    for (const action of actionSet.postActions) {
      if (action.actionType === 'actionSet' && action.actionSetKey) {
        const circularPath = checkCircularReference(action.actionSetKey, new Set(visited))
        if (circularPath) {
          return [targetKey, ...circularPath]
        }
      }
    }

    return null
  }

  // 利用可能なアクションセットのリスト
  const availableActionSets = computed(() => {
    if (!data.value?.actionSets) return []

    return Object.entries(data.value.actionSets).map(([key, actionSet]) => {
      const isSelf = key === props.currentKey
      const circularPath = checkCircularReference(key)

      return {
        key,
        name: actionSet.name || key || '(名前なし)',
        disabled: isSelf || circularPath !== null,
        circularPath,
      }
    })
  })

  // 循環参照があるかチェック
  const hasCircularReference = computed(() => {
    if (!actionSetKey.value) return false
    return checkCircularReference(actionSetKey.value) !== null
  })

  // 循環参照の経路を表示用に整形
  const circularReferencePath = computed(() => {
    if (!actionSetKey.value) return ''
    const path = checkCircularReference(actionSetKey.value)
    if (!path) return ''

    return path
      .map((key) => {
        if (!data.value?.actionSets) return key
        const actionSet = data.value.actionSets[key]
        return actionSet?.name || key
      })
      .join(' → ')
  })
</script>
