<!-- src/configMaker/components/comments/CharacterBulkChanger.vue -->
<!-- !使用しない(移行) -->
<template>
  <div>
    <!-- トリガーボタン -->
    <div
      class="tooltip tooltip-bottom"
      :data-tip="
        hasInvalidCharacters ? '存在しないキャラクターが使用されています！' : 'このおみくじのキャラクターを変更する'
      "
    >
      <button :class="['btn', hasInvalidCharacters ? 'btn-error animate-pulse' : 'btn-info']" @click="openModal">
        <Users class="w-4 h-4" />キャラ変更
        <span v-if="hasInvalidCharacters" class="ml-1">⚠️</span>
      </button>
    </div>

    <!-- モーダル -->
    <div v-if="isModalOpen" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">キャラクター一括変更</h3>

        <div class="space-y-4">
          <!-- 現在のキャラクター情報 -->
          <div class="bg-base-200 p-3 rounded">
            <p class="text-sm text-gray-600 mb-2">現在使用されているキャラクター:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="charKey in uniqueCharacterKeys"
                :key="charKey"
                :class="['badge', getCharacterName(charKey) ? 'badge-outline' : 'badge-error animate-pulse']"
              >
                {{ getCharacterName(charKey) || `⚠️ 未定義: ${charKey || '空欄'}` }}
              </span>
            </div>
          </div>

          <!-- エラー警告 -->
          <div v-if="hasInvalidCharacters" class="alert alert-error">
            <AlertTriangle class="w-4 h-4" />
            <span class="text-sm"> 存在しないキャラクターが使用されています。キャラクターを変更してください。 </span>
          </div>

          <!-- 個別変更セクション -->
          <div class="space-y-3">
            <h4 class="font-semibold text-md">キャラクターの変更</h4>
            <div
              v-for="charKey in uniqueCharacterKeys"
              :key="charKey"
              class="flex items-center gap-3 p-3 bg-base-100 rounded-lg border"
              :class="getCharacterName(charKey) ? 'border-base-300' : 'border-error'"
            >
              <!-- 変更前 -->
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">変更前</p>
                <div :class="['badge badge-lg', getCharacterName(charKey) ? 'badge-outline' : 'badge-error']">
                  {{ getCharacterName(charKey) || `⚠️ ${charKey || '空欄'}` }}
                </div>
              </div>

              <!-- 矢印 -->
              <div class="text-2xl text-gray-400">→</div>

              <!-- 変更後 -->
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">変更後</p>
                <select v-model="characterMappings[charKey]" class="select select-bordered select-sm w-full">
                  <option value="">変更しない</option>
                  <option v-for="character in charactersArray" :key="character.id" :value="character.id">
                    {{ character.name || character.id }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- 確認メッセージ -->
          <div v-if="hasChanges" class="alert alert-warning">
            <AlertTriangle class="w-4 h-4" />
            <span class="text-sm"> 選択されたキャラクターが一括変更されます。この操作は元に戻せません。 </span>
          </div>
        </div>

        <!-- モーダルアクション -->
        <ModalFooterActions
          class="mt-4"
          :on-cancel="closeModal"
          :on-save="changeAllCharacters"
          saveName="変更する"
          :disabled="!hasChanges"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { Users, AlertTriangle } from 'lucide-vue-next'
  import { useCharacterChanger } from './CharacterChanger/useCharacterChanger'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // コンポーザブル
  const {
    charactersArray,
    getCharacterName,
    extractCharacterKeys,
    countInvalidCharacters,
    applyCharacterMappings,
    createModalState,
  } = useCharacterChanger()

  // モーダル状態
  const { isModalOpen, characterMappings, openModal: openModalBase, closeModal, hasChanges } = createModalState()

  // 現在のおみくじデータを取得
  const currentOmikujiSets = computed(() => {
    const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
    return record?.omikuji || []
  })

  // 現在使用されているキャラクターキーを取得
  const uniqueCharacterKeys = computed(() => {
    return extractCharacterKeys(currentOmikujiSets.value)
  })

  // 存在しないキャラクターがあるかチェック
  const hasInvalidCharacters = computed(() => {
    return countInvalidCharacters(uniqueCharacterKeys.value) > 0
  })

  // モーダル開閉
  const openModal = () => {
    const initialMappings: Record<string, string> = {}
    // 存在しないキャラクターの場合は、最初から選択を促す
    uniqueCharacterKeys.value.forEach((charKey) => {
      if (!getCharacterName(charKey)) {
        initialMappings[charKey] = ''
      }
    })
    openModalBase(initialMappings)
  }

  // キャラクター一括変更
  const changeAllCharacters = () => {
    if (!hasChanges.value) return

    const newOmikujiSets = applyCharacterMappings(currentOmikujiSets.value, characterMappings.value)

    // ストアを使って直接更新
    omikujiStore.updateItem(props.category, props.selectedRuleId, {
      omikuji: newOmikujiSets,
    })

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
