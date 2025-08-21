<!-- src/configMaker/components/OmikujiItemEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="card bg-base-100 p-4 border-l-4 mb-4"
    :class="{
      'border-l-primary': index % 2 === 0,
      'border-l-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- OmikujiSetBasic コンポーネント -->
      <OmikujiSetBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selected-rule-id="selectedRuleId"
      />

      <!-- Post Actions Editor コンポーネント with 子コンポーネント -->
      <PostActionsEditor :modelValue="omikujiItem.postActions" @toggleJson="toggleEditMode" @toggleEdit="openDialog" />

      <!-- プレビュー表示 -->
      <PostActionsPreview v-if="!isJsonMode" :modelValue="omikujiItem.postActions" />

      <!-- JSON編集モード -->
      <PostActionsEditorJson
        v-else
        v-model="omikujiItem.postActions"
        :charactersArray="charactersArray"
        @close="isJsonMode = false"
      />
    </div>

    <!-- 編集ダイアログ -->
    <PostActionsEditDialog ref="dialog" v-model="omikujiItem.postActions" :charactersArray="charactersArray" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, Ref } from 'vue'
  import { RuleType } from '@/types/OmikujiData/OmikujiDataSchema'
  import OmikujiSetBasic from './OmikujiSetBasic.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import PostActionsPreview from '@ConfigComponents/postAction/PostActionsPreview.vue'
  import PostActionsEditDialog from '@ConfigComponents/postAction/PostActionsEditDialog.vue'
  import PostActionsEditorJson from '@ConfigComponents/postAction/PostActionsEditorJson.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    category: 'comments' | 'timers'
    selectedRuleId: string | null
    index: number // カードの色分け用
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // キャラクター配列を取得
  const charactersArray = computed(() => omikujiStore.getCategoryArray('characters'))

  // Refs for PostActions functionality
  const dialog: Ref<InstanceType<typeof PostActionsEditDialog> | null> = ref(null)
  const isJsonMode = ref(false)

  // ストアからデータを取得
  const ruleData = computed(() => {
    if (!props.selectedRuleId) return null
    return omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType | null
  })

  // 全てのおみくじセット
  const allOmikujiSets = computed(() => {
    return ruleData.value?.omikuji || []
  })

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })

  // PostActions methods
  const openDialog = () => {
    dialog.value?.open()
  }

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
  }
</script>
