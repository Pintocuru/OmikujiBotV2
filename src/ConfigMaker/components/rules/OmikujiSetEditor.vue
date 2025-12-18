<!-- src\ConfigMaker\components\rules\OmikujiSetEditor.vue -->
<template>
  <div v-if="selectedItemKey">
    <!-- ツールバー -->
    <div class="flex justify-end gap-2 mb-4">
      <!-- カード表示切替 -->
      <div class="form-control">
        <label class="label cursor-pointer gap-2">
          <span class="label-text">カード表示</span>
          <input type="checkbox" v-model="isCardMode" class="toggle toggle-primary" />
        </label>
      </div>

      <!-- キャラクター一括変更ボタン -->
      <CharacterChanger :category="category" :selectedId="selectedItemKey" />

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

    <!-- カードモードコントロール -->
    <OmikujiSetControls
      v-if="isCardMode"
      :items="omikujiSets"
      :totalWeight="totalWeight"
      @sort="handleSort"
      @update:items="omikujiSets = $event"
      class="mb-4"
    />

    <!-- アイテムリスト -->
    <draggable
      v-model="omikujiSets"
      item-key="id"
      handle=".drag-handle"
      animation="200"
      :class="isCardMode ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'"
    >
      <template #item="{ element, index }">
        <div :key="element.id || `omikuji-${index}`" class="draggable-item">
          <OmikujiCardEditor v-if="isCardMode" :category="category" :selectedItemKey="selectedItemKey" :index="index" />
          <OmikujiItemEditor v-else :category="category" :selectedItemKey="selectedItemKey" :index="index" />
        </div>
      </template>
    </draggable>

    <button @click="addOmikuji" class="btn btn-primary w-full mt-4">
      <Plus class="w-4 h-4" />
      おみくじを追加
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import { OmikujiItemSchema, OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import CharacterChanger from '@ConfigComponents/rules/CharacterChanger/CharacterChanger.vue'
  import OmikujiItemEditor from '@ConfigComponents/rules/OmikujiItemEditor.vue'
  import OmikujiCardEditor from '@ConfigComponents/rules/OmikujiCardEditor.vue'
  import OmikujiSetControls from './OmikujiSetControls.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useWeightCalculation } from './composables/useWeightCalculation'
  import draggable from 'vuedraggable'
  import { Dices, Plus } from 'lucide-vue-next'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  // State
  const isCardMode = ref(true)

  // Computed
  const omikujiSets = computed({
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

  // weight計算のコンポーザブルを使用
  const { totalWeight } = useWeightCalculation(omikujiSets)

  // Methods
  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]
  }

  // ソート処理
  const handleSort = (payload: { type: 'weight' | 'name'; order?: 'asc' | 'desc' }) => {
    let sorted = [...omikujiSets.value]

    if (payload.type === 'weight') {
      sorted.sort((a, b) => {
        return payload.order === 'desc' ? b.weight - a.weight : a.weight - b.weight
      })
    } else if (payload.type === 'name') {
      sorted.sort((a, b) => {
        const aName = a.name || ''
        const bName = b.name || ''
        return aName.localeCompare(bName, 'ja')
      })
    }

    omikujiSets.value = sorted
  }
</script>
