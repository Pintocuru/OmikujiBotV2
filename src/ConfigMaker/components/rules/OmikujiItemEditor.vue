<!-- src/configMaker/components/OmikujiItemEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="card bg-base-100 p-2 border-x-4 mb-4"
    :class="{
      'border-x-primary': index % 2 === 0,
      'border-x-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- OmikujiItemBasic コンポーネント -->
      <OmikujiItemBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selected-rule-id="selectedRuleId"
      />

      <!-- ツールバー -->
      <OmikujiItemToolbar
        :actions="omikujiItem.postActions"
        :category="category"
        :selected-rule-id="selectedRuleId"
        @toggleJson="toggleEditMode"
        @toggleEdit="toggleTabEditor"
      />

      <!-- PostActionsタブエディター -->
      <PostActionsTabEditor
        v-if="isTabEditorOpen"
        :actions="omikujiItem.postActions"
        @update:actions="updatePostActions"
      />

      <!-- JSON編集モード -->
      <PostActionsEditorJson
        v-if="isJsonMode"
        :category="category"
        :selected-rule-id="selectedRuleId"
        :omikuji-index="index"
        @close="isJsonMode = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, Ref } from 'vue'
  import OmikujiItemBasic from './OmikujiItemBasic.vue'
  import OmikujiItemToolbar from '@/ConfigMaker/components/postAction/OmikujiItemToolbar.vue'
  import PostActionsTabEditor from '@ConfigComponents/postAction/PostActionsTabEditor.vue'
  import PostActionsEditorJson from '@ConfigComponents/postAction/PostActionsEditorJson.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Refs for PostActions functionality
  const isJsonMode = ref(false)
  const isTabEditorOpen = ref(false)

  // Computed
  const allOmikujiSets = computed({
    get: () => {
      if (!props.selectedRuleId) return []
      const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
      return record?.omikuji || []
    },
    set: (value: OmikujiItemType[]) => {
      if (!props.selectedRuleId) return
      omikujiStore.updateRecordProperty(props.category, props.selectedRuleId, 'omikuji', value)
    },
  })

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })

  // PostActions methods
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
    if (!props.selectedRuleId) return

    const updatedOmikuji = [...allOmikujiSets.value]
    if (updatedOmikuji[props.index]) {
      updatedOmikuji[props.index] = {
        ...updatedOmikuji[props.index],
        postActions: newActions,
      }
      allOmikujiSets.value = updatedOmikuji
    }
  }
</script>
