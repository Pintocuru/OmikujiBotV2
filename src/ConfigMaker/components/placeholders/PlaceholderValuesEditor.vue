<!-- src/ConfigMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <template v-if="selectedItem">
    <div class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="selectedItem.values.length > 0" :values="selectedItem.values" />

      <!-- 編集モード切り替えボタン -->
      <button
        @click="toggleMode"
        class="btn bg-primary text-primary-content"
        :class="{ 'btn-active': isTextMode }"
        title="編集モードを切り替え"
      >
        {{ isTextMode ? '🔧 入力モード' : '📝 テキストモード' }}
      </button>
    </div>

    <!-- 入力モード -->
    <PlaceholderInputMode v-if="!isTextMode" :placeholderId="props.placeholderKey" :values="selectedItem.values" />

    <!-- テキストモード -->
    <PlaceholderTextMode
      v-else
      :initialValues="selectedItem.values"
      @save="handleTextSave"
      @cancel="isTextMode = false"
    />
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { PlaceholderType, WeightValuesArrayType } from '@/types/OmikujiData/PlaceholderSchema'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import PlaceholderPreview from './PlaceholderPreview.vue'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    placeholderKey: string
  }>()

  // store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const isTextMode = ref(false)

  // ストアから直接データを取得
  const selectedItem = computed({
    get: () => {
      if (!props.placeholderKey) return null
      return data.value.placeholders[props.placeholderKey]
    },
    set: (value: PlaceholderType) => {
      omikujiStore.updateItem('placeholders', value.key, value)
    },
  })

  // モード切り替え
  const toggleMode = () => {
    isTextMode.value = !isTextMode.value
  }

  // テキストモードからの保存
  const handleTextSave = (values: WeightValuesArrayType) => {
    omikujiStore.updatePlaceholderValues(props.placeholderKey, values)
    isTextMode.value = false
  }
</script>
