<!-- src/configMaker/components/comments/GlobalCharacterChanger.vue -->
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
      <button :class="['btn', hasInvalidCharacters ? 'btn-error animate-pulse' : 'btn-secondary']" @click="openModal">
        <Users class="w-4 h-4" />全体キャラ変更
        <span v-if="hasInvalidCharacters" class="ml-1">⚠️</span>
      </button>
    </div>

    <!-- モーダル -->
    <div v-if="isModalOpen" class="modal modal-open">
      <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-lg mb-4">{{ categoryLabel }}ルール全体のキャラクター一括変更</h3>

        <div class="space-y-4">
          <!-- 統計情報 -->
          <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
            <div class="stat">
              <div class="stat-title">対象ルール数</div>
              <div class="stat-value text-primary">{{ totalRules }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">使用中のキャラクター</div>
              <div class="stat-value text-secondary">{{ uniqueCharacterKeys.length }}</div>
            </div>
            <div class="stat" :class="hasInvalidCharacters ? 'bg-error/10' : ''">
              <div class="stat-title">未定義キャラクター</div>
              <div :class="['stat-value', hasInvalidCharacters ? 'text-error' : 'text-success']">
                {{ invalidCharacterCount }}
              </div>
            </div>
          </div>

          <!-- 現在のキャラクター情報 -->
          <div class="bg-base-200 p-4 rounded-lg">
            <p class="text-sm font-semibold text-gray-600 mb-3">現在使用されているキャラクター:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="charKey in uniqueCharacterKeys"
                :key="charKey"
                :class="['badge badge-lg', getCharacterName(charKey) ? 'badge-outline' : 'badge-error animate-pulse']"
              >
                {{ getCharacterName(charKey) || `⚠️ 未定義: ${charKey || '空欄'}` }}
                <span class="ml-1 text-xs opacity-70">({{ characterUsageCount[charKey] }}箇所)</span>
              </span>
            </div>
          </div>

          <!-- エラー警告 -->
          <div v-if="hasInvalidCharacters" class="alert alert-error">
            <AlertTriangle class="w-4 h-4" />
            <div class="flex-1">
              <span class="font-semibold">存在しないキャラクターが使用されています。</span>
              <p class="text-sm mt-1">
                これらのキャラクターは正常に動作しません。適切なキャラクターに変更してください。
              </p>
            </div>
          </div>

          <!-- 個別変更セクション -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-md">キャラクターの変更設定</h4>
              <button class="btn btn-sm btn-ghost" @click="clearAllMappings" :disabled="!hasChanges">
                すべてクリア
              </button>
            </div>

            <div
              v-for="charKey in uniqueCharacterKeys"
              :key="charKey"
              class="flex items-center gap-3 p-4 bg-base-100 rounded-lg border-2 transition-all"
              :class="getCharacterName(charKey) ? 'border-base-300' : 'border-error shadow-error/20 shadow-lg'"
            >
              <!-- 変更前 -->
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500 mb-1">変更前</p>
                <div
                  :class="[
                    'badge badge-lg w-full justify-start truncate',
                    getCharacterName(charKey) ? 'badge-outline' : 'badge-error',
                  ]"
                >
                  {{ getCharacterName(charKey) || `⚠️ ${charKey || '空欄'}` }}
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ characterUsageCount[charKey] }}箇所で使用中</p>
              </div>

              <!-- 矢印 -->
              <div class="text-3xl text-gray-400 flex-shrink-0">→</div>

              <!-- 変更後 -->
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500 mb-1">変更後</p>
                <select
                  v-model="characterMappings[charKey]"
                  class="select select-bordered w-full"
                  :class="characterMappings[charKey] ? 'select-primary' : ''"
                >
                  <option value="">変更しない</option>
                  <option v-for="character in charactersArray" :key="character.id" :value="character.id">
                    {{ character.name || character.id }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- 変更内容のプレビュー -->
          <div v-if="hasChanges" class="alert alert-warning">
            <AlertTriangle class="w-4 h-4" />
            <div class="flex-1">
              <span class="font-semibold">変更内容の確認</span>
              <ul class="text-sm mt-2 space-y-1">
                <li v-for="(newCharId, oldCharKey) in characterMappings" :key="oldCharKey">
                  <span v-if="newCharId">
                    「{{ getCharacterName(oldCharKey) || oldCharKey }}」 → 「{{ getCharacterName(newCharId) }}」 ({{
                      characterUsageCount[oldCharKey]
                    }}箇所)
                  </span>
                </li>
              </ul>
              <p class="text-sm mt-3 font-semibold text-warning-content">
                ⚠️ この操作は{{ categoryLabel }}カテゴリ全体に影響します。元に戻すことはできません。
              </p>
            </div>
          </div>
        </div>

        <!-- モーダルアクション -->
        <ModalFooterActions
          class="mt-6"
          :on-cancel="closeModal"
          :on-save="changeAllCharacters"
          saveName="変更を実行"
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
  import { useCharacterChanger } from './composables/useCharacterChanger'

  const props = defineProps<{
    category: RulesCategoryType
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // コンポーザブル
  const {
    charactersArray,
    getCharacterName,
    extractCharacterKeys,
    countCharacterUsage,
    countInvalidCharacters,
    applyCharacterMappings,
    createModalState,
  } = useCharacterChanger()

  // カテゴリラベル
  const categoryLabel = computed(() => (props.category === 'comments' ? 'コメント' : 'タイマー'))

  // モーダル状態
  const {
    isModalOpen,
    characterMappings,
    openModal: openModalBase,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = createModalState()

  // カテゴリ内の全ルールを取得
  const allRules = computed(() => {
    return omikujiStore.getCategoryArray(props.category) as RuleType[]
  })

  const totalRules = computed(() => allRules.value.length)

  // 全ルールのおみくじセットを結合
  const allOmikujiSets = computed(() => {
    return allRules.value.flatMap((rule) => rule.omikuji)
  })

  // 全ルールから使用されているキャラクターキーを収集
  const uniqueCharacterKeys = computed(() => {
    return extractCharacterKeys(allOmikujiSets.value)
  })

  // 各キャラクターの使用箇所数をカウント
  const characterUsageCount = computed(() => {
    return countCharacterUsage(allOmikujiSets.value)
  })

  // 存在しないキャラクターがあるかチェック
  const hasInvalidCharacters = computed(() => {
    return invalidCharacterCount.value > 0
  })

  // 未定義キャラクターの数
  const invalidCharacterCount = computed(() => {
    return countInvalidCharacters(uniqueCharacterKeys.value)
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

    // 各ルールを更新
    allRules.value.forEach((rule) => {
      const newOmikujiSets = applyCharacterMappings(rule.omikuji, characterMappings.value)

      // ストアを使って直接更新
      omikujiStore.updateItem(props.category, rule.id, {
        omikuji: newOmikujiSets,
      })
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
