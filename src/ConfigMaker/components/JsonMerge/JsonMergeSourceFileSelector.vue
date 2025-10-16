<!-- src/configMaker/components/jsonMerge/JsonMergeSourceFileSelector.vue -->
<template>
  <SettingItem label="マージ元ファイル">
    <select :value="modelValue" @change="handleChange" class="select select-bordered w-full">
      <option value="">ファイルを選択してください</option>
      <option v-for="file in jsonFiles" :key="file" :value="file">
        {{ file }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  // Props
  const props = defineProps<{
    modelValue: string
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const jsonFiles = ref<string[]>([])

  // JSONファイルリストを取得
  onMounted(async () => {
    try {
      const apiUrl = 'http://localhost:3001/api/dev-configs/list'

      const res = await fetch(apiUrl)
      if (res.ok) {
        const files = await res.json()
        jsonFiles.value = files.map((f: any) => f.name || f)
      } else {
        console.error('API Error:', res.status, res.statusText)
      }
    } catch (err) {
      console.error('JSONファイル取得エラー:', err)
    }
  })

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
  }
</script>
