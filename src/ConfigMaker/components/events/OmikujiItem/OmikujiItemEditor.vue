<!-- src/ConfigMaker/components/events/OmikujiItem/OmikujiItemEditor.vue -->
<template>
  <!-- ヘッダー(名前、メニュー) -->
  <OmikujiItemHeader
    :category="category"
    :omikujiItem="omikujiItem"
    :index="index"
    :selectedItemKey="selectedItemKey"
  />

  <!-- 実行内容 -->
  <SettingItem v-if="shouldShowTypeSelector" label="実行内容" description="このおみくじの処理内容を選択します">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(option, key) in filteredActionSetMap"
        :key="key"
        class="badge cursor-pointer select-none"
        :class="omikujiItem.type === key ? 'badge-primary' : 'badge-ghost'"
        @click="updateType(key as ActionSetKind)"
      >
        {{ option }}
      </span>
    </div>
  </SettingItem>

  <!-- サブタイトル -->
  <SubSectionHeader
    :icon="actionSetKindMap[omikujiItem.type].icon"
    :title="actionSetKindMap[omikujiItem.type].label"
    :description="actionSetKindMap[omikujiItem.type].description"
  />

  <!-- GameScripts コンポーネント -->
  <GameScriptsEditor
    v-if="omikujiItem.type === 'gameScripts'"
    :category="category"
    :index="index"
    :selectedItemKey="selectedItemKey"
  />

  <!-- PostActions編集コンポーネント -->
  <PostActionsEditor v-else-if="omikujiItem.type === 'postActions'" v-model="postActions" :gameScripts="gameScripts" />

  <!-- Special編集コンポーネント -->
  <SpecialActionEditor
    v-else-if="omikujiItem.type === 'special'"
    :category="category"
    :index="index"
    :selectedItemKey="selectedItemKey"
  />
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { ActionSetKind, actionSetKindMap, PostFlowType } from '@/types'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import PostActionsEditor from '@config/components/postAction/PostActionsEditor.vue'
  import GameScriptsEditor from '@config/components/gameScripts/GameScriptsEditor.vue'
  import SpecialActionEditor from './SpecialActionEditor.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { EventCategoryType } from '@/types/OmikujiData/'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    category: EventCategoryType
    selectedItemKey: string | null
    index: number
  }>()

  // Pinia store
  const { data, updateOmikujiByIndex, updateRecordProperty } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // Computed
  const omikujiSets = computed(() => {
    if (!props.selectedItemKey) return []
    const record = getItem(props.category, props.selectedItemKey)
    return record?.omikuji || []
  })

  const omikujiItem = computed(() => {
    return omikujiSets.value[props.index] || null
  })

  // 利用可能なゲームスクリプトがあるかチェック
  const hasAvailableScripts = computed(() => data.featureUsage.gameScripts.length > 0)

  // category === "comments" 以外では special を選択不可
  const canUseSpecial = computed(() => props.category === 'comments')

  // 利用可能な ActionSet を絞り込む
  const filteredActionSetMap = computed(() => {
    const result: Record<string, string> = {}
    Object.entries(actionSetKindMap).forEach(([key, value]) => {
      if (key === 'gameScripts' && !hasAvailableScripts.value) return
      if (key === 'special' && !canUseSpecial.value) return
      result[key] = value.label
    })
    return result
  })

  // 実行内容セレクタを表示するか（選択肢が2つ以上ある場合のみ）
  const shouldShowTypeSelector = computed(() => {
    return Object.keys(filteredActionSetMap.value).length > 1
  })

  // postActionsのgetter/setter
  const postActions = computed({
    get: () => {
      return omikujiItem.value?.postActions || []
    },
    set: (newActions: PostFlowType[]) => {
      if (!props.selectedItemKey) return

      const updatedOmikuji = [...omikujiSets.value]
      if (updatedOmikuji[props.index]) {
        updatedOmikuji[props.index] = {
          ...updatedOmikuji[props.index],
          postActions: newActions,
        }
        updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', updatedOmikuji)
      }
    },
  })

  const gameScripts = computed(() => omikujiItem.value?.gameScripts || null)

  const updateType = (value: ActionSetKind) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      type: value,
    }))
  }

  // 選択肢が1つしかない場合、自動的にその type に設定
  watch(
    () => [filteredActionSetMap.value, omikujiItem.value],
    () => {
      const availableTypes = Object.keys(filteredActionSetMap.value) as ActionSetKind[]

      if (availableTypes.length === 1 && omikujiItem.value?.type !== availableTypes[0]) {
        updateType(availableTypes[0])
      }
    },
    { immediate: true }
  )
</script>
