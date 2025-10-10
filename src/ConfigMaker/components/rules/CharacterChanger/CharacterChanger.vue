<!-- src/ConfigMaker/rules/CharacterChanger/CharacterChanger.vue -->
<template>
  <div>
    <!-- トリガーボタン -->
    <div
      class="tooltip tooltip-bottom"
      :data-tip="
        hasInvalidCharacters
          ? '存在しないキャラクターが使用されています！'
          : 'すべてのルールのキャラクターを一括変更する'
      "
    >
      <button
        :class="[
          'btn',
          hasInvalidCharacters
            ? 'btn-error animate-pulse'
            : changeScope === 'single'
              ? `btn-${props.buttonStyle}`
              : 'btn-secondary',
        ]"
        @click="openModal"
      >
        <Users class="w-4 h-4" />
        {{ changeScope === 'single' ? 'キャラ変更' : '全体キャラ変更' }}
        <span v-if="hasInvalidCharacters" class="ml-1">⚠️</span>
      </button>
    </div>

    <!-- モーダル -->
    <div v-if="isModalOpen" class="modal modal-open">
      <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-lg mb-4">{{ scopeLabel }}のキャラクター一括変更</h3>

        <div class="space-y-4">
          <!-- 統計情報（カテゴリ全体の場合のみ表示） -->
          <CharacterStatistics
            v-if="changeScope === 'category'"
            :total-items="totalItems"
            :unique-character-count="uniqueCharacterKeys.length"
            :invalid-character-count="invalidCharacterCount"
            :has-invalid-characters="hasInvalidCharacters"
          />

          <!-- 現在のキャラクター情報 -->
          <CurrentCharacterList
            :character-keys="uniqueCharacterKeys"
            :usage-count="characterUsageCount"
            :get-character-name="getCharacterName"
          />

          <!-- エラー警告 -->
          <InvalidCharacterAlert v-if="hasInvalidCharacters" />

          <!-- 個別変更セクション -->
          <CharacterMappingEditor
            :character-keys="uniqueCharacterKeys"
            :character-mappings="characterMappings"
            :characters-array="charactersArray"
            :usage-count="characterUsageCount"
            :get-character-name="getCharacterName"
            :has-changes="hasChanges"
            @clear-all="clearAllMappings"
          />

          <!-- 変更内容のプレビュー -->
          <MappingPreview
            v-if="hasChanges"
            :character-mappings="characterMappings"
            :usage-count="characterUsageCount"
            :scope-label="scopeLabel"
            :get-character-name="getCharacterName"
          />
        </div>

        <!-- モーダルアクション -->
        <ModalFooterActions
          class="mt-6"
          :on-cancel="closeModal"
          :on-save="executeCharacterChange"
          saveName="変更を実行"
          :disabled="!hasChanges"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import { Users } from 'lucide-vue-next'
  import { TargetCategoryType, useDataExtractor } from './useDataExtractor'
  import { useCharacterData } from './useCharacterData'
  import { useCharacterStats } from './useCharacterStats'
  import { useModalState } from './useModalState'
  import { useCharacterUpdater } from './useCharacterUpdater'
  import CharacterStatistics from './CharacterStatistics.vue'
  import CurrentCharacterList from './CurrentCharacterList.vue'
  import InvalidCharacterAlert from './InvalidCharacterAlert.vue'
  import CharacterMappingEditor from './CharacterMappingEditor.vue'
  import MappingPreview from './MappingPreview.vue'

  const props = withDefaults(
    defineProps<{
      category: TargetCategoryType
      selectedId?: string
      buttonStyle?: 'primary' | 'secondary' | 'info'
    }>(),
    {
      selectedId: undefined,
      buttonStyle: 'secondary',
    }
  )

  // データ抽出（selectedIdがある場合は単一ルールのみ対象）
  const { changeScope, categoryLabel, scopeLabel, allItems, allPostActions, totalItems } = useDataExtractor(
    props.category,
    props.selectedId
  )

  // キャラクターデータ
  const { charactersArray, getCharacterName } = useCharacterData()

  // キャラクター統計
  const { uniqueCharacterKeys, characterUsageCount, invalidCharacterCount, hasInvalidCharacters } =
    useCharacterStats(allPostActions)

  // モーダル状態
  const {
    isModalOpen,
    characterMappings,
    openModal: openModalBase,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useModalState()

  // キャラクター更新処理
  const { applyMappingsToAllItems } = useCharacterUpdater(props.category, allItems, props.selectedId)

  /**
   * モーダルを開く（未定義キャラクターは初期選択状態に）
   */
  const openModal = () => {
    const initialMappings: Record<string, string> = {}
    uniqueCharacterKeys.value.forEach((charKey) => {
      if (!getCharacterName(charKey)) {
        initialMappings[charKey] = ''
      }
    })
    openModalBase(initialMappings)
  }

  /**
   * キャラクター変更を実行
   */
  const executeCharacterChange = () => {
    if (!hasChanges.value) return
    applyMappingsToAllItems(characterMappings.value)
    closeModal()
  }
</script>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
