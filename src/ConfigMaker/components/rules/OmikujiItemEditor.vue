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
      <!-- OmikujiItemBasic コンポーネント -->
      <OmikujiItemBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selected-rule-id="selectedRuleId"
      />

      <!-- ツールバー -->
      <OmikujiItemToolbar :modelValue="omikujiItem.postActions" @toggleJson="toggleEditMode" @toggleEdit="openDialog" />

      <!-- JSON編集モード -->
      <PostActionsEditorJson
        v-if="isJsonMode"
        :category="category"
        :selected-rule-id="selectedRuleId"
        :omikuji-index="index"
        @close="isJsonMode = false"
      />
    </div>

    <!-- 編集ダイアログ -->
    <PostActionsEditDialog
      ref="dialog"
      :category="category"
      :selected-rule-id="selectedRuleId"
      :omikuji-index="index"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, Ref } from 'vue'
  import OmikujiItemBasic from './OmikujiItemBasic.vue'
  import OmikujiItemToolbar from '@/ConfigMaker/components/postAction/OmikujiItemToolbar.vue'
  import PostActionsPreview from '@ConfigComponents/postAction/PostActionsPreview.vue'
  import PostActionsEditDialog from '@ConfigComponents/postAction/PostActionsEditDialog.vue'
  import PostActionsEditorJson from '@ConfigComponents/postAction/PostActionsEditorJson.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Refs for PostActions functionality
  const dialog: Ref<InstanceType<typeof PostActionsEditDialog> | null> = ref(null)
  const isJsonMode = ref(false)

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
  const openDialog = () => {
    dialog.value?.open()
  }

  const toggleEditMode = () => {
    isJsonMode.value = !isJsonMode.value
  }
</script>
