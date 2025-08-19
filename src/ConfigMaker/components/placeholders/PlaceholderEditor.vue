<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <!-- プレースホルダー編集エリア -->
  <div v-if="selectedItem">
    <div class="card bg-base-300 mt-4">
      <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">基本設定</div>
      <div class="card-body space-y-3">
        <!-- ID表示とコピー -->
        <SettingItem label="Key" description="<<プレースホルダー名>>" :showReset="false" containerClass="form-control">
          <div class="flex gap-2 items-center">
            <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
              {{ selectedItem.id }}
            </div>
            <!-- コピーボタン -->
            <CopyButton :value="`<<${selectedItem.id}>>`" dataTip="<<プレースホルダー>>の形式で文字列をコピーします" />
            <!-- 編集ボタン -->
            <IdEditor :currentId="selectedItem.id" category="placeholders" />
          </div>
        </SettingItem>

        <!-- プレースホルダー名 -->
        <SettingItem label="設定名" description="識別しやすい名前" :showReset="false" containerClass="form-control">
          <input
            type="text"
            v-model="selectedItem.name"
            placeholder="設定名を入力"
            class="input input-bordered w-full"
          />
        </SettingItem>
      </div>
    </div>
    <!-- プレースホルダー設定セクション -->
    <div class="card bg-base-300 mt-4">
      <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center">
        <div class="flex items-center">プレースホルダー設定</div>
        <!-- 抽選テストボタン -->
        <PlaceholderPreview v-if="selectedItem.values.length > 0" :id="selectedItem.id" :values="selectedItem.values" />
      </div>
      <div class="card-body">
        <PlaceholderValuesEditor :key="selectedItem.id" :placeholderId="selectedItem.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PlaceholderType } from '@/types'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import PlaceholderPreview from './PlaceholderPreview.vue'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import IdEditor from '@ConfigComponents/parts/IdEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CopyButton from '@ConfigComponents/parts/CopyButton.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'

  // ストアを使用
  const omikujiStore = useOmikujiStore()
  const { data, selectedRuleId } = storeToRefs(omikujiStore)

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedRuleId.value) return null
      return data.value.placeholders[selectedRuleId.value]
    },
    set: (value: PlaceholderType) => {
      omikujiStore.updateItem('placeholders', value.id, value)
    },
  })
</script>
