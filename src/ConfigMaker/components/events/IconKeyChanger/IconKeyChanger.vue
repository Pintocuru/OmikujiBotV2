<!-- src/ConfigMaker/components/events/IconKeyChanger/IconKeyChanger.vue -->
<template>
  <div
    v-if="isCharacter"
    class="tooltip tooltip-bottom"
    :data-tip="
      hasInvalidIconKeys ? '不正なアイコンキーが使用されています！' : 'すべてのイベントのアイコンキーを一括変更する'
    "
  >
    <button :class="['btn', hasInvalidIconKeys ? 'btn-error animate-pulse' : 'btn-secondary']" @click="openModal">
      <ImageIcon class="w-4 h-4" />
      {{ changeScope === 'single' ? 'アイコン変更' : '全体アイコン変更' }}
      <span v-if="hasInvalidIconKeys" class="ml-1">⚠️</span>
    </button>
  </div>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 class="font-bold text-lg mb-4">{{ scopeLabel }}のアイコンキー一括変更</h3>

      <div class="space-y-4">
        <!-- エラー統計 -->
        <div v-if="hasInvalidIconKeys" class="stats shadow w-full">
          <div class="stat bg-error/10">
            <div class="stat-title">不正アイコンキー</div>
            <div class="stat-value text-error">{{ invalidIconKeyCount }}</div>
          </div>
        </div>

        <!-- エラー警告 -->
        <div v-if="hasInvalidIconKeys" class="alert alert-error">
          <AlertTriangle class="w-4 h-4" />
          <div class="flex-1">
            <span class="font-semibold">存在しないアイコンキーが使用されています。</span>
            <p class="text-sm mt-1">画像が表示されません。有効なキーへ変更してください。</p>
          </div>
        </div>

        <!-- 不正キーがない場合 -->
        <div v-else class="alert alert-success">
          <span>すべてのアイコンキーは有効です。</span>
        </div>

        <!-- 変更エディター -->
        <IconKeyMappingEditor
          :invalid-pairs="invalidIconKeyPairs"
          :icon-key-mappings="iconKeyMappings"
          :usage-count="iconKeyUsageCount"
          :has-changes="hasChanges"
          @clear-all="clearAllMappings"
          @update-mapping="updateMapping"
        />

        <!-- 変更プレビュー -->
        <div v-if="hasChanges" class="alert alert-warning">
          <AlertTriangle class="w-4 h-4" />
          <div class="flex-1">
            <span class="font-semibold">変更内容の確認</span>
            <ul class="text-sm mt-2 space-y-1">
              <li v-for="(newKey, compositeKey) in iconKeyMappings" :key="compositeKey">
                <span v-if="newKey">
                  {{ formatPreviewLabel(compositeKey) }} → 「{{ newKey }}」 ({{
                    iconKeyUsageCount[compositeKey] ?? 0
                  }}箇所)
                </span>
              </li>
            </ul>
            <p class="text-sm mt-3 font-semibold text-warning-content">
              ⚠️ この操作は{{ scopeLabel }}に影響します。元に戻すことはできません。
            </p>
          </div>
        </div>
      </div>

      <ModalFooterActions
        class="mt-6"
        :on-cancel="closeModal"
        :on-save="executeIconKeyChange"
        saveName="変更を実行"
        :disabled="!hasChanges"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ImageIcon, AlertTriangle } from 'lucide-vue-next'
  import IconKeyMappingEditor from './IconKeyMappingEditor.vue'
  import ModalFooterActions from '@config/components/parts/ModalFooterActions.vue'
  import { TargetCategoryType, useDataExtractor } from '../CharacterChanger/useDataExtractor'
  import { useIconKeyStats } from './useIconKeyStats'
  import { useIconKeyModalState } from './useIconKeyModalState'
  import { useIconKeyUpdater } from './useIconKeyUpdater'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
  }>()

  const { isCharacter } = useVisibilityAccess()
  const { getCharacterName } = useCharacterManager()

  const { changeScope, scopeLabel, allItems, allActionSets } = useDataExtractor(props.category, props.selectedId)

  const { invalidIconKeyPairs, iconKeyUsageCount, hasInvalidIconKeys, invalidIconKeyCount } =
    useIconKeyStats(allActionSets)

  const {
    isModalOpen,
    iconKeyMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useIconKeyModalState()

  const { applyMappingsToAllItems } = useIconKeyUpdater(props.category, allItems)

  /**
   * モーダルを開く（不正キーを初期選択状態に）
   */
  const openModal = () => {
    const initialMappings: Record<string, string> = {}
    invalidIconKeyPairs.value.forEach(({ characterKey, iconKey }) => {
      initialMappings[`${characterKey}:${iconKey}`] = ''
    })
    openModalBase(initialMappings)
  }

  /**
   * "characterKey:iconKey" → 表示用ラベル
   */
  const formatPreviewLabel = (compositeKey: string): string => {
    const [characterKey, iconKey] = compositeKey.split(':')
    const charName = getCharacterName(characterKey) || characterKey
    return `「${charName} / ${iconKey}」`
  }

  /**
   * iconKey変更を実行
   */
  const executeIconKeyChange = () => {
    if (!hasChanges.value) return
    applyMappingsToAllItems(iconKeyMappings.value)
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
