<!-- src/configMaker/components/comments/OmikujiSetEditor.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>
        おみくじ設定 <span class="text-base pl-2">( {{ omikujiSets.length }} item / 総重量: {{ totalWeight }} )</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- キャラクター一括変更ボタン -->
        <CharacterBulkChanger :model-value="omikujiSets" @update:model-value="omikujiSets = $event" />
        <!-- おみくじテストボタン -->
        <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
          <button
            @click="postTestOmikuji(omikujiSets)"
            class="btn btn-ghost btn-sm"
            :disabled="omikujiSets.length === 0"
          >
            <Dices class="w-4 h-4" />
            抽選テスト
          </button>
        </div>
      </div>
    </template>

    <template #body>
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

      <button @click="addOmikuji" class="btn btn-primary btn-sm w-full">
        <Plus class="w-4 h-4" />
        おみくじセットを追加
      </button>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemSchema, OmikujiSetType } from '@/types/OmikujiData/OmikujiSchema'
  import { RuleType } from '@/types/OmikujiData/OmikujiDataSchema'
  import CharacterBulkChanger from './CharacterBulkChanger.vue'
  import OmikujiItemEditor from './OmikujiItemEditor.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import draggable from 'vuedraggable'
  import { Dices, Plus } from 'lucide-vue-next'

  const props = defineProps<{
    category: 'comments' | 'timers'
    selectedRuleId: string | null
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // Computed
  const omikujiSets = computed({
    get: () => {
      if (!props.selectedRuleId) return []
      const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
      return record?.omikuji || []
    },
    set: (value: OmikujiSetType[]) => {
      if (!props.selectedRuleId) return
      omikujiStore.updateRecordProperty(props.category, props.selectedRuleId, 'omikuji', value)
    },
  })

  const { postTestOmikuji } = useTestPost()

  // 合計重みの計算
  const totalWeight = computed(() => {
    return omikujiSets.value.reduce((sum, omikuji) => sum + (omikuji.weight || 0), 0)
  })

  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]
  }
</script>
