<!-- src/configMaker/components/comments/OmikujiSetEditor.vue -->
<template>
  <div v-if="selectedRuleId">
    <!-- 便利なボタン群 -->
    <div class="flex justify-end gap-2">
      <!-- キャラクター一括変更ボタン -->
      <CharacterBulkChanger :category="category" :selected-rule-id="selectedRuleId" />

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
    <draggable v-model="omikujiSets" item-key="id" handle=".drag-handle" animation="200">
      <template #item="{ element, index }">
        <div :key="element.id || `omikuji-${index}`" class="draggable-item">
          <!-- エラーバウンダリー的な処理 -->
          <div v-if="element && typeof element === 'object'">
            <OmikujiItemEditor :category="category" :selected-rule-id="selectedRuleId" :index="index" />
          </div>
          <div v-else class="p-4 bg-red-50 border border-red-200 rounded">
            <p class="text-red-600">アイテムの読み込みでエラーが発生しました</p>
          </div>
        </div>
      </template>
    </draggable>

    <button @click="addOmikuji" class="btn btn-primary w-full">
      <Plus class="w-4 h-4" />
      おみくじを追加
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
  import { OmikujiItemSchema, OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import CharacterBulkChanger from './CharacterBulkChanger.vue'
  import OmikujiItemEditor from './OmikujiItemEditor.vue'
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

  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]
  }
</script>
