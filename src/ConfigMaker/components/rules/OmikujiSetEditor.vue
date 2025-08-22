<!-- src/configMaker/components/comments/OmikujiSetEditor.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>
        おみくじ設定 <span class="text-base pl-2">( {{ omikujiSets.length }} item / 総重量: {{ totalWeight }} )</span>
      </div>
      <div class="text-sm pr-2">おみくじの抽選設定や、おみくじの内容です。</div>
    </template>

    <template #body>
      <!-- 便利なボタン群 -->
      <div class="flex justify-end gap-2">
        <!-- キャラクター一括変更ボタン -->
        <CharacterBulkChanger v-if="selectedRuleId" :category="category" :selected-rule-id="selectedRuleId" />

        <!-- おみくじテストボタン -->
        <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
          <button
            class="btn btn-info"
            @click="useTestPost().postTestOmikuji(omikujiSets)"
            :disabled="omikujiSets.length === 0"
          >
            <Dices class="w-4 h-4" />
            抽選テスト
          </button>
        </div>

        <button @click="addOmikuji" class="btn btn-primary">
          <Plus class="w-4 h-4" />
          おみくじを追加
        </button>
      </div>
      <!-- vuedraggable を使用したドラッグアンドドロップ -->
      <draggable
        v-model="omikujiSets"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-50"
        chosen-class="opacity-75"
        drag-class="opacity-25"
        animation="200"
      >
        <template #item="{ element, index }">
          <OmikujiItemEditor :category="category" :selected-rule-id="selectedRuleId" :index="index" />
        </template>
      </draggable>

      <button @click="addOmikuji" class="btn btn-primary w-full">
        <Plus class="w-4 h-4" />
        おみくじを追加
      </button>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
  import { OmikujiItemSchema, OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import CharacterBulkChanger from './CharacterBulkChanger.vue'
  import OmikujiItemEditor from './OmikujiItemEditor.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import draggable from 'vuedraggable'
  import { Dices, Plus } from 'lucide-vue-next'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Computed
  const omikujiSets = computed({
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

  // 合計重みの計算
  const totalWeight = computed(() => {
    return omikujiSets.value.reduce((sum, omikuji) => sum + (omikuji.weight || 0), 0)
  })

  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]
  }
</script>
