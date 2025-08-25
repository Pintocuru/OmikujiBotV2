<!-- src/configMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <div class="space-y-4">
    <div v-if="selectedItem" class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="selectedItem.values.length > 0" :id="selectedItem.id" :values="selectedItem.values" />

      <!-- 編集モード切り替えボタン -->
      <button
        @click="toggleMode"
        class="btn bg-primary"
        :class="{ 'btn-active': isTextMode }"
        title="編集モードを切り替え"
      >
        {{ isTextMode ? '🔧 入力モード' : '📝 テキストモード' }}
      </button>
    </div>

    <!-- 入力モード -->
    <div v-if="!isTextMode && selectedItem">
      <PlaceholderInputMode :placeholderId="props.placeholderId" :values="selectedItem.values" />
    </div>

    <!-- テキストモード -->
    <div v-else-if="selectedItem">
      <PlaceholderTextMode :initialValues="selectedItem.values" @save="handleTextSave" @cancel="isTextMode = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { PlaceholderType, PlaceholderValueType } from '@/types/OmikujiData/PlaceholderSchema'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import PlaceholderPreview from './PlaceholderPreview.vue'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    placeholderId: string
  }>()

  // store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const isTextMode = ref(false)

  // ストアから直接データを取得
  const selectedItem = computed({
    get: () => {
      if (!props.placeholderId) return null
      return data.value.placeholders[props.placeholderId]
    },
    set: (value: PlaceholderType) => {
      omikujiStore.updateItem('placeholders', value.id, value)
    },
  })

  // モード切り替え
  const toggleMode = () => {
    isTextMode.value = !isTextMode.value
  }

  // テキストモードからの保存
  const handleTextSave = (values: Array<PlaceholderValueType | string>) => {
    omikujiStore.updatePlaceholderValues(props.placeholderId, values)
    isTextMode.value = false
  }
</script>
