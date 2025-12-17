<!-- src\ConfigMaker\components\rules\OmikujiItemEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="bg-base-100 p-2 border-l-6 mb-4"
    :class="{
      'border-x-primary': index % 2 === 0,
      'border-x-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- ヘッダー（名前、メニュー） -->
      <OmikujiItemHeader
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />

      <!-- OmikujiItemBasic コンポーネント -->
      <h3 class="font-semibold border-b pt-3 pb-1">追加条件と重み - このおみくじが適用される条件や確率を設定します</h3>
      <OmikujiItemBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />

      <!-- GameScripts コンポーネント -->
      <h3 class="font-semibold border-b pt-3 pb-1">ゲームスクリプト - 複雑な処理を行うスクリプト設定</h3>
      <GameScriptsEditor
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />

      <!-- PostActions編集コンポーネント -->
      <h3 class="font-semibold border-b pt-3 pb-1">アクション - おみくじの内容や演出を設定します</h3>
      <PostActionsEditor v-model="postActions" :gameScripts="gameScripts" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import OmikujiItemBasic from './OmikujiItemBasic.vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import GameScriptsEditor from '@ConfigComponents/gameScripts/GameScriptsEditor.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Computed
  const allOmikujiSets = computed({
    get: () => {
      if (!props.selectedItemKey) return []
      const record = omikujiStore.getItem(props.category, props.selectedItemKey) as RuleType
      return record?.omikuji || []
    },
    set: (value: OmikujiItemType[]) => {
      if (!props.selectedItemKey) return
      omikujiStore.updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', value)
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
