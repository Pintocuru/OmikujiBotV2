<!-- src\ConfigMaker\components\rules\OmikujiItemEditor.vue -->
<template>
  <!-- ヘッダー（名前、メニュー） -->
  <OmikujiItemHeader
    :allOmikuji="allOmikujiSets"
    :omikuji="omikujiItem"
    :category="category"
    :selectedItemKey="selectedItemKey"
  />

  <!-- OmikujiItemBasic コンポーネント -->
  <OmikujiItemPriority
    v-if="category === 'comments'"
    :allOmikuji="allOmikujiSets"
    :omikuji="omikujiItem"
    :category="category"
    :selectedItemKey="selectedItemKey"
  />

  <!-- GameScripts コンポーネント -->

  <GameScriptsEditor
    :allOmikuji="allOmikujiSets"
    :omikuji="omikujiItem"
    :category="category"
    :selectedItemKey="selectedItemKey"
  />

  <!-- PostActions編集コンポーネント -->
  <PostActionsEditor v-model="postActions" :gameScripts="gameScripts" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/'
  import OmikujiItemPriority from './OmikujiItemPriority.vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'
  import PostActionsEditor from '@config/components/postAction/PostActionsEditor.vue'
  import GameScriptsEditor from '@config/components/gameScripts/GameScriptsEditor.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // Computed
  const allOmikujiSets = computed({
    get: () => {
      if (!props.selectedItemKey) return []
      const record = getItem(props.category, props.selectedItemKey)
      return record?.omikuji || []
    },
    set: (value: OmikujiItemType[]) => {
      if (!props.selectedItemKey) return
      updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', value)
    },
  })

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })

  // postActionsのgetter/setter
  const postActions = computed({
    get: () => {
      return omikujiItem.value?.postActions || []
    },
    set: (newActions: PostActionType[]) => {
      if (!props.selectedItemKey) return

      const updatedOmikuji = [...allOmikujiSets.value]
      if (updatedOmikuji[props.index]) {
        updatedOmikuji[props.index] = {
          ...updatedOmikuji[props.index],
          postActions: newActions,
        }
        allOmikujiSets.value = updatedOmikuji
      }
    },
  })
  const gameScripts = computed(() => omikujiItem.value?.gameScripts || null)
</script>
