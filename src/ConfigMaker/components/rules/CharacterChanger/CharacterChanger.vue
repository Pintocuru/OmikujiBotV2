<!-- src/ConfigMaker/components/rules/CharacterChanger/CharacterChanger.vue -->
<template>
  <!-- トリガーボタン -->
  <div
    v-if="isCharacter"
    class="tooltip tooltip-bottom"
    :data-tip="
      hasInvalidCharacters
        ? '存在しないキャラクターが使用されています！'
        : 'すべてのイベントのキャラクターを一括変更する'
    "
  >
    <button :class="['btn', hasInvalidCharacters ? 'btn-error animate-pulse' : 'btn-secondary']" @click="openModal">
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
        <CurrentCharacterList :character-keys="uniqueCharacterKeys" :usage-count="characterUsageCount" />

        <!-- エラー警告 -->
        <InvalidCharacterAlert v-if="hasInvalidCharacters" />

        <!-- 個別変更セクション -->
        <CharacterMappingEditor
          :character-keys="uniqueCharacterKeys"
          :character-mappings="characterMappings"
          :usage-count="characterUsageCount"
          :has-changes="hasChanges"
          @clear-all="clearAllMappings"
          @update-mapping="updateMapping"
        />

        <!-- 変更内容のプレビュー -->
        <MappingPreview
          v-if="hasChanges"
          :character-mappings="characterMappings"
          :usage-count="characterUsageCount"
          :scope-label="scopeLabel"
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
</template>

<script setup lang="ts">
  import CharacterStatistics from './CharacterStatistics.vue'
  import CurrentCharacterList from './CurrentCharacterList.vue'
  import InvalidCharacterAlert from './InvalidCharacterAlert.vue'
  import CharacterMappingEditor from './CharacterMappingEditor.vue'
  import MappingPreview from './MappingPreview.vue'
  import { TargetCategoryType, useDataExtractor } from './useDataExtractor'
  import { useCharacterStats } from './useCharacterStats'
  import { useModalState } from './useModalState'
  import { useCharacterUpdater } from './useCharacterUpdater'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import ModalFooterActions from '@config/components/parts/ModalFooterActions.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { Users } from 'lucide-vue-next'

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
  }>()

  // キャラクターデータ
  const { isCharacter } = useVisibilityAccess()
  const { getCharacterName } = useCharacterManager()

  // データ抽出（selectedIdがある場合は単一イベントのみ対象）
  const { changeScope, scopeLabel, allItems, allActionSets, totalItems } = useDataExtractor(
    props.category,
    props.selectedId
  )

  // キャラクター統計
  const { uniqueCharacterKeys, characterUsageCount, invalidCharacterCount, hasInvalidCharacters } =
    useCharacterStats(allActionSets)

  // モーダル状態
  const {
    isModalOpen,
    characterMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useModalState()

  // キャラクター更新処理
  const { applyMappingsToAllItems } = useCharacterUpdater(props.category, allItems)

  /**
   * モーダルを開く（未定義キャラクターは初期選択状態に）
   */
  const openModal = () => {
    const initialMappings: Record<string, string> = {}
    uniqueCharacterKeys.value.forEach((charKey) => {
      if (!getCharacterName(charKey)) initialMappings[charKey] = ''
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
