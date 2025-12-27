<!-- src\ConfigMaker\components\postAction\tooltab\PostActionsTabs.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs">
    <!-- プレースホルダータブ（固定） -->
    <button
      v-if="isPlaceholder"
      class="tab tab-sm rounded"
      :class="{ 'tab-active bg-info text-info-content': activeTab === -1 }"
      @click="setActiveTab(-1)"
    >
      📝 プレースホルダー
    </button>

    <!-- PostActionタブ -->
    <button
      v-for="(action, index) in props.modelValue"
      :key="`action-${index}`"
      class="tab tab-sm rounded pr-1 flex items-center justify-between gap-2"
      :class="{ 'tab-active bg-info text-info-content': activeTab === index }"
      @click="setActiveTab(index)"
    >
      <!-- 左側：バッジと内容 -->
      <div class="flex items-center">
        <span class="badge badge-sm badge-primary mr-2">{{ index + 1 }}</span>
        <PostActionRow :action="action" />
      </div>

      <!-- 右側：メニュー -->
      <div @click.stop>
        <MenuDropdown v-if="activeTab === index" @duplicate="duplicateAction(index)" @delete="removeAction(index)" />
      </div>
    </button>

    <!-- 追加ボタン -->
    <button class="tab tab-sm" @click="addNewAction">＋ 追加</button>
  </div>

  <!-- タブコンテンツ -->
  <div>
    <!-- アクションが空の場合 -->
    <div v-if="props.modelValue.length === 0">
      <NoParamsCard message="PostActionがありません" />
      <button @click="addNewAction" class="btn btn-primary btn-sm">最初のアクションを追加</button>
    </div>

    <!-- プレースホルダーリストタブの内容 -->
    <div v-else-if="activeTab === -1">
      <PlaceholderList :actions="props.modelValue" @open-placeholder="handleOpenPlaceholder" />
    </div>

    <!-- PostActionタブの内容 -->
    <div v-else-if="props.modelValue.length > 0 && activeTab >= 0">
      <PostActionItem
        :action="currentAction"
        :index="activeTab"
        :character-options="characterOptions"
        @update:action="updateCurrentAction"
        @duplicate="duplicateAction"
        @remove="removeAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import PostActionRow from './PostActionRow.vue'
  import { usePostActionsTab } from '../composables/usePostActionsTab'
  import PostActionItem from '../items/PostActionItem.vue'
  import { useCharacterEmotions } from '@ConfigComponents/parts/useCharacterEmotions'
  import PlaceholderList from '@ConfigComponents/placeholders/PlaceholderList.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'

  const props = defineProps<{
    modelValue: PostActionType[]
  }>()

  const emit = defineEmits<{
    'update:actions': [actions: PostActionType[]]
    'open-placeholder': [placeholderId: string, editorColor?: string | null]
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // プレースホルダー機能が見えているか
  const isPlaceholder = computed(() => hasAccess(data.value.featureUsage.usage.placeholders))

  // キャラクターオプションの取得
  const { charactersMap } = useCharacterEmotions()
  const characterOptions = computed(() => {
    return Object.entries(charactersMap.value).map(([key, char]) => ({
      value: key,
      label: char.name,
    }))
  })

  // タブロジックをコンポーザブルから取得
  const { activeTab, currentAction, setActiveTab, updateCurrentAction, addNewAction, duplicateAction, removeAction } =
    usePostActionsTab(
      computed(() => props.modelValue),
      (event, actions) => emit(event, actions),
      characterOptions
    )

  // プレースホルダーを開く処理
  const handleOpenPlaceholder = (placeholderId: string, editorColor?: string | null) => {
    emit('open-placeholder', placeholderId, editorColor)
  }
</script>
