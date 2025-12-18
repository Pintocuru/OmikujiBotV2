<!-- src\ConfigMaker\components\rules\OmikujiCardEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="bg-base-100 p-2 border-l-6 mb-4"
    :class="{
      'border-x-primary': index % 2 === 0,
      'border-x-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- ヘッダー（名前、メニュー） -->
      <OmikujiItemHeader
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selectedItemKey="selectedItemKey"
        :isCard="true"
      />
      <!-- おみくじデータを1列でバッジ表示 -->
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="omikujiItem?.isPriority" class="badge badge-primary gap-1">
          <Crown class="w-3 h-3" />
          優先
        </span>

        <span v-if="omikujiItem?.criteria" class="badge badge-secondary gap-1">
          <Filter class="w-3 h-3" />
          条件
        </span>

        <span v-if="omikujiItem?.gameScripts" class="badge badge-accent gap-1">
          <Gamepad2 class="w-3 h-3" />
          Script
        </span>

        <span class="badge badge-outline gap-1">
          <ListChecks class="w-3 h-3" />
          {{ postActions.length }}
        </span>

        <!-- 使用キャラクター（例：最初の message から取得する想定） -->
        <CharacterIcon
          v-for="(action, i) in messageActions"
          :key="i"
          :character-key="action.characterKey"
          :icon-key="action.iconKey"
          :size="6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'
  import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { OmikujiItemType, PostActionMessageType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import { Crown, Filter, Gamepad2, ListChecks } from 'lucide-vue-next'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Computed
  const allOmikujiSets = computed({
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

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })

  // postActions
  const postActions = computed(() => omikujiItem.value?.postActions || [])

  const messageActions = computed<PostActionMessageType[]>(() => {
    if (!omikujiItem.value) return []

    return omikujiItem.value.postActions.filter((a): a is PostActionMessageType => a.actionType === 'message')
  })
</script>
