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
        <template #item="{ element: omikuji, index }">
          <div
            class="card bg-base-100 p-4 border-l-4 mb-4"
            :class="{
              'border-l-primary': index % 2 === 0,
              'border-l-secondary': index % 2 === 1,
            }"
          >
            <!-- OmikujiItem コンポーネント -->
            <OmikujiSetBasic
              :allOmikuji="omikujiSets"
              :omikuji="omikuji"
              :disable-delete="omikujiSets.length <= 1"
              @update:name="updateOmikuji(index, 'name', $event)"
              @update:weight="updateOmikuji(index, 'weight', $event)"
              @duplicate="duplicateOmikuji(index)"
              @delete="removeOmikuji(index)"
            />

            <!-- Post Actions Editor コンポーネント JSON編集機能付き -->
            <PostActionsEditor v-model="omikuji.postActions" />
          </div>
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
  import { OmikujiSetSchema, OmikujiSetType, RuleType } from '@/types/'
  import CharacterBulkChanger from './CharacterBulkChanger.vue'
  import OmikujiSetBasic from './OmikujiSetBasic.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import draggable from 'vuedraggable'
  import { Dices, Plus } from 'lucide-vue-next'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    category: 'comments' | 'timers'
    selectedRuleId: string | null
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // createComputedを使用してPiniaストアとの双方向バインディングを作成
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

  // 統合された更新関数
  const updateOmikuji = (index: number, key: keyof OmikujiSetType, value: any) => {
    const newValue = [...omikujiSets.value]
    newValue[index] = { ...newValue[index], [key]: value }
    omikujiSets.value = newValue
  }

  const addOmikuji = () => {
    const newOmikuji = OmikujiSetSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]
  }

  const removeOmikuji = (index: number) => {
    if (omikujiSets.value.length <= 1) return
    const newValue = [...omikujiSets.value]
    newValue.splice(index, 1)
    omikujiSets.value = newValue
  }

  const duplicateOmikuji = (index: number) => {
    const original = omikujiSets.value[index]
    const duplicated = { ...JSON.parse(JSON.stringify(original)), name: `${original.name} (コピー)` }
    const newValue = [...omikujiSets.value]
    newValue.splice(index + 1, 0, duplicated)
    omikujiSets.value = newValue
  }
</script>
