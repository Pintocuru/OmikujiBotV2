<!-- src/ConfigMaker/components/JsonMerge/JsonMergeSourceFileSelector.vue -->
<template>
  <div class="space-y-3">
    <!-- マージ元ファイル -->
    <SettingItem label="マージ元ファイル">
      <select
        :value="currentMergeItem.sourceFile"
        @change="handleSourceFileChange"
        class="select select-bordered w-full"
      >
        <option disabled value="">ファイルを選択してください</option>
        <option v-for="file in jsonFiles" :key="file" :value="file">
          {{ file }}
        </option>
      </select>

      <!-- エラーメッセージ -->
      <p v-if="!currentMergeItem.sourceFile" class="text-red-500 mt-2">入力されてません</p>
    </SettingItem>

    <!-- キーサフィックス -->
    <SettingItem label="複数用のキーサフィックス" description="マージ時に元のキーに付加する接尾辞">
      <input
        type="text"
        :value="currentMergeItem.keySuffix"
        @input="handleKeySuffixChange"
        class="input input-bordered w-full"
        placeholder="キャラクターキーを入力(1文字目は自動で大文字になります)"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { configApi } from '@/PresetManager/services/configApi'

  const props = defineProps<{
    mergeIndex: number
  }>()

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  const jsonFiles = ref<string[]>([])

  // 現在のマージアイテムを取得
  const currentMergeItem = computed(() => {
    return data.value.jsonMerge?.[props.mergeIndex] ?? { sourceFile: '', keySuffix: '' }
  })

  // JSONファイルリストを取得
  onMounted(async () => {
    try {
      const files = await configApi.getFileList()
      jsonFiles.value = files.map((f) => f.name)
    } catch (err) {
      console.error('JSONファイル取得エラー:', err)
    }
  })

  // ソースファイル変更時の処理
  const handleSourceFileChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    updateMergeItem({ sourceFile: target.value })
  }

  // キーサフィックス変更時の処理
  const handleKeySuffixChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateMergeItem({ keySuffix: target.value })
  }

  // マージアイテムを更新
  const updateMergeItem = (updates: Partial<typeof currentMergeItem.value>) => {
    if (!data.value.jsonMerge) return

    const newMerge = [...data.value.jsonMerge]
    newMerge[props.mergeIndex] = {
      ...newMerge[props.mergeIndex],
      ...updates,
    }

    store.updateJsonMerge(newMerge)
  }
</script>
