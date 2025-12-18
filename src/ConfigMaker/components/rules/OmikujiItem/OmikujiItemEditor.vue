<!-- src\ConfigMaker\components\rules\OmikujiItemEditor.vue -->
<template>
  <div class="card bg-base-100 p-2 space-y-4">
    <!-- ヘッダー（名前、メニュー） -->
    <OmikujiItemHeader
      :allOmikuji="allOmikujiSets"
      :omikuji="omikujiItem"
      :category="category"
      :selectedItemKey="selectedItemKey"
    />

    <!-- OmikujiItemBasic コンポーネント -->
    <SectionCard
      v-if="category === 'comments'"
      variant="primary"
      title="追加条件"
      description="このおみくじが適用される追加の条件を設定します"
    >
      <OmikujiItemBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />
    </SectionCard>

    <!-- GameScripts コンポーネント -->
    <SectionCard variant="primary" title="ゲームスクリプト" description="複雑な処理を行うスクリプト設定">
      <GameScriptsEditor
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
      />
    </SectionCard>

    <!-- PostActions編集コンポーネント -->
    <PostActionsEditor v-model="postActions" :gameScripts="gameScripts" />
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
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SectionCard from '@shared/components/parts/SectionCard.vue'

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
      const record = omikujiStore.getItem(props.category, props.selectedItemKey)
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
