<!-- src/ConfigMaker/components/events/OmikujiSetEditor.vue -->
<template>
  <div v-if="selectedItemKey" class="space-y-4">
    <!-- ツールバー -->
    <div class="flex justify-end gap-2">
      <!-- キャラクター一括変更ボタン -->
      <CharacterChanger :category="category" :selectedId="selectedItemKey" />
      <IconKeyChanger :category="category" :selectedId="selectedItemKey" />

      <!-- おみくじテストボタン -->
      <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
        <button class="btn btn-info" @click="postTestOmikuji(omikujiSets)" :disabled="omikujiSets.length === 0">
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
    <OmikujiWeightProgressBar
      :category="category"
      :selectedItemKey="selectedItemKey"
      :items="omikujiSets"
      :selectedId="selectedOmikujiId"
      @update:items="omikujiSets = $event"
      @update:weight="({ index, weight }) => (omikujiSets = updateItemWeight(omikujiSets, index, weight))"
      @select="selectedOmikujiId = $event"
    />

    <!-- 選択されたアイテムの編集 -->
    <template v-if="selectedOmikujiIndex !== null">
      <!-- 帯ヘッダー -->
      <div
        class="flex items-center justify-between px-4 py-2 font-bold text-white"
        :style="{ backgroundColor: getColorForIndex(selectedOmikujiIndex) }"
      >
        <h3 class="text-sm md:text-base">
          おみくじ編集:
          {{ omikujiSets[selectedOmikujiIndex]?.name || `アイテム${selectedOmikujiIndex + 1}` }}
        </h3>
      </div>

      <!-- 本文 -->
      <OmikujiItemEditor :category="category" :selectedItemKey="selectedItemKey" :index="selectedOmikujiIndex" />
    </template>

    <!-- 選択していない場合のメッセージ -->
    <div v-else class="card bg-base-200 shadow p-6 text-center">
      <p class="text-base-content/60">上のリストからおみくじアイテムをクリックして編集してください</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { OmikujiItemSchema, OmikujiItemType, EventCategoryType } from '@/types/OmikujiData/'
  import OmikujiWeightProgressBar from './OmikujiCard/OmikujiWeightProgressBar.vue'
  import CharacterChanger from '@config/components/events/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@config/components/events/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiItemEditor from '@config/components/events/OmikujiItem/OmikujiItemEditor.vue'
  import { useTestPost } from '@config/scripts/useTestPost'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { Dices, Plus } from 'lucide-vue-next'
  import { getColorForIndex, updateItemWeight } from './OmikujiCard/useOmikujiWeight'

  const props = defineProps<{
    category: EventCategoryType
    selectedItemKey: string | null
  }>()

  const { updateRecordProperty } = useOmikujiStore()
  const { getItem } = useGetRecordData()
  const { postTestOmikuji } = useTestPost()

  // 選択されたおみくじアイテムのインデックス
  const selectedOmikujiId = ref<string | null>(null)

  // Computed
  const omikujiSets = computed({
    get: () => {
      if (!props.selectedItemKey) return []
      const record = getItem(props.category, props.selectedItemKey)
      return record?.omikuji || []
    },
    set: (value: OmikujiItemType[]) => {
      if (!props.selectedItemKey) return
      updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', value)
    },
  })

  const selectedOmikujiIndex = computed(() => {
    if (!selectedOmikujiId.value) return null
    return omikujiSets.value.findIndex((v) => v.id === selectedOmikujiId.value)
  })

  // Methods
  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    omikujiSets.value = [...omikujiSets.value, newOmikuji]

    selectedOmikujiId.value = newOmikuji.id
  }

  watch(
    () => props.selectedItemKey,
    () => {
      if (omikujiSets.value.length === 0) {
        selectedOmikujiId.value = null
      } else {
        selectedOmikujiId.value = omikujiSets.value[0].id
      }
    }
  )
</script>
