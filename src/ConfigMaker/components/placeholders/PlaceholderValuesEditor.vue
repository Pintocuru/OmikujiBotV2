<!-- src/configMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <div class="space-y-4">
    <div v-if="selectedItem" class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="selectedItem.values.length > 0" :id="selectedItem.id" :values="selectedItem.values" />

      <!-- 編集モード切り替えボタン -->
      <button
        @click="toggleEditMode"
        class="btn bg-primary"
        :class="{ 'btn-active': isTextMode }"
        title="編集モードを切り替え"
      >
        {{ isTextMode ? '🔧 入力モード' : '📝 テキストモード' }}
      </button>
    </div>

    <!-- 入力モード -->
    <PlaceholderInputMode
      v-if="!isTextMode"
      :local-values="localValues"
      @add-value="addValue"
      @remove-value="removeValue"
      @duplicate-value="duplicateValue"
    />

    <!-- テキストモード -->
    <PlaceholderTextMode
      v-else
      :text-content="textContent"
      :line-count="lineCount"
      :has-errors="hasErrors"
      :valid-items-count="validItemsCount"
      :error-count="errorCount"
      @update:text-content="textContent = $event"
      @update-line-count="updateLineCount"
      @save="saveTextContent"
      @cancel="handleCancelTextMode"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { usePlaceholderValues } from './composables/usePlaceholderValues'
  import { useTextModeParser } from './composables/useTextModeParser'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import PlaceholderPreview from './PlaceholderPreview.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    placeholderId: string
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // コンポーザブルの使用
  // これ専用
  const { localValues, initializeValues, addValue, removeValue, duplicateValue } = usePlaceholderValues(
    props.placeholderId
  )

  // これ専用
  const {
    textContent,
    lineCount,
    hasErrors,
    validItemsCount,
    errorCount,
    updateLineCount,
    convertValuesToText,
    convertTextToValues,
  } = useTextModeParser()

  // リアクティブデータ
  const isTextMode = ref(false)

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!props.placeholderId) return null
      return data.value.placeholders[props.placeholderId]
    },
    set: (value: PlaceholderType) => {
      omikujiStore.updateItem('placeholders', value.id, value)
    },
  })

  // 編集モード切り替え
  const toggleEditMode = () => {
    if (!isTextMode.value) {
      // 入力モードからテキストモードへ
      convertValuesToText(localValues.value)
    } else {
      // テキストモードから入力モードへ
      if (!hasErrors.value && validItemsCount.value > 0) {
        localValues.value = convertTextToValues()
      }
    }
    isTextMode.value = !isTextMode.value
  }

  // テキストコンテンツの保存
  const saveTextContent = () => {
    if (hasErrors.value || validItemsCount.value === 0) return

    const newValues = convertTextToValues()
    omikujiStore.updatePlaceholderValues(props.placeholderId, newValues)
    toggleEditMode()
  }

  // キャンセル時の処理（テキストモードから入力モードへ戻る）
  const handleCancelTextMode = () => {
    isTextMode.value = false
  }

  // 監視
  watch(textContent, updateLineCount)

  // 初期化
  initializeValues()
</script>
