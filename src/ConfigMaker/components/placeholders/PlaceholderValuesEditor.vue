<!-- src/configMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 編集モード切り替えボタン -->
    <div class="flex justify-end">
      <button
        @click="toggleEditMode"
        class="btn btn-sm bg-secondary"
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
  import { ref, watch } from 'vue'
  import { PlaceholderValueType } from '@/types/'
  import { usePlaceholderValues } from './composables/usePlaceholderValues'
  import { useTextModeParser } from './composables/useTextModeParser'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    placeholderId: string
  }>()

  const emit = defineEmits<{
    valuesChanged: [values: Array<PlaceholderValueType>]
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

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
    omikujiStore.updateRecordProperty('placeholders', props.placeholderId, 'values', newValues)
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
