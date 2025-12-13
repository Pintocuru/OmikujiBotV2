<!-- src\ConfigMaker\components\postAction\items\ActionSetSettings.vue -->
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
  import { PostActionActionSetType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { checkCircularReference } from '@/MainGenerator/scripts/OmikujiProcess/ActionSetValidator'
  import { storeToRefs } from 'pinia'
  import { XCircle } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostActionActionSetType
    currentKey?: string
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionActionSetType]
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const updateAction = (updates: Partial<PostActionActionSetType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const actionSetKey = computed({
    get: () => props.action.actionSetKey || '',
    set: (value) => updateAction({ actionSetKey: value }),
  })

  // 利用可能なアクションセットのリスト
  const availableActionSets = computed(() => {
    if (!data.value?.actionSets) return []

    return Object.entries(data.value.actionSets).map(([key, actionSet]) => {
      const isSelf = key === props.currentKey
      const circularPath = checkCircularReference(key, data.value.actionSets, props.currentKey)

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
    if (!actionSetKey.value || !data.value?.actionSets) return false
    return checkCircularReference(actionSetKey.value, data.value.actionSets, props.currentKey) !== null
  })

  // 循環参照の経路を表示用に整形
  const circularReferencePath = computed(() => {
    if (!actionSetKey.value || !data.value?.actionSets) return ''
    const path = checkCircularReference(actionSetKey.value, data.value.actionSets, props.currentKey)
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
