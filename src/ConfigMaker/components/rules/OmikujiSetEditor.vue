<!-- src/ConfigMaker/components/rules/OmikujiSetEditor.vue -->
<template>
  <div v-if="selectedItemKey" class="space-y-4">
    <!-- ツールバー -->
    <div class="flex justify-end gap-2">
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

    <!-- おみくじリスト一覧（クリックで選択） -->
    <OmikujiCardControls
      :items="omikujiSets"
      :totalWeight="totalWeight"
      :selectedIndex="selectedOmikujiIndex"
      @sort="handleSort"
      @update:items="omikujiSets = $event"
      @select="selectedOmikujiIndex = $event"
    />

    <!-- 選択されたアイテムの編集 -->
    <div
      v-if="selectedOmikujiIndex !== null"
      class="card bg-base-100 shadow-lg p-4"
      :style="{ backgroundColor: getColorForIndex(selectedOmikujiIndex) }"
    >
      <div class="card-title justify-between mb-4">
        <h3 class="text-lg font-bold text-white">
          おみくじ編集: {{ omikujiSets[selectedOmikujiIndex]?.name || `アイテム${selectedOmikujiIndex + 1}` }}
        </h3>
        <button @click="selectedOmikujiIndex = null" class="btn btn-sm btn-ghost text-white hover:bg-white/20">
          <X class="w-4 h-4" />
          閉じる
        </button>
      </div>

      <OmikujiItemEditor :category="category" :selectedItemKey="selectedItemKey" :index="selectedOmikujiIndex" />
    </div>

    <!-- 選択していない場合のメッセージ -->
    <div v-else class="card bg-base-200 shadow p-6 text-center">
      <p class="text-base-content/60">上のリストからおみくじアイテムをクリックして編集してください</p>
    </div>

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
  import OmikujiItemEditor from '@/ConfigMaker/components/rules/OmikujiItem/OmikujiItemEditor.vue'
  import OmikujiCardControls from './OmikujiCard/OmikujiCardControls.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useWeightCalculation } from './composables/useWeightCalculation'
  import { Dices, Plus, X } from 'lucide-vue-next'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  // 選択されたおみくじアイテムのインデックス
  const selectedOmikujiIndex = ref<number | null>(null)

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

      // 選択インデックスが範囲外になったらリセット
      if (selectedOmikujiIndex.value !== null && selectedOmikujiIndex.value >= value.length) {
        selectedOmikujiIndex.value = null
      }
    },
  })

  // weight計算のコンポーザブルを使用
  const { totalWeight } = useWeightCalculation(omikujiSets)

  // Methods
  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]

    // 新しく追加したアイテムを自動選択
    selectedOmikujiIndex.value = omikujiSets.value.length - 1
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

    // ソート後、選択をリセット
    selectedOmikujiIndex.value = null
  }

  // プログレスバーと同じ色を取得
  const getColorForIndex = (index: number): string => {
    const colors = [
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#6366f1',
      '#84cc16',
      '#ef4444',
      '#14b8a6',
      '#f97316',
      '#a855f7',
    ]
    return colors[index % colors.length]
  }
</script>
