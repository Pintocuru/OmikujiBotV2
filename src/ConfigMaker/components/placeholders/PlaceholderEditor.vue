<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <div v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard :isGild="true">
      <template #header
        ><div>基本設定</div>
        <div class="text-sm pr-2">プレースホルダー名の設定を行います</div>
      </template>

      <template #body>
        <!-- ID表示とコピー -->
        <SettingItem label="Key" description="<<プレースホルダー名>>">
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
        <SettingItem label="設定名" description="識別しやすい名前">
          <input
            type="text"
            v-model="selectedItem.name"
            placeholder="設定名を入力"
            class="input input-bordered w-full"
          />
        </SettingItem>
      </template>
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard>
      <template #header>
        <div>プレースホルダー設定</div>
        <div class="text-sm pr-2">抽選するプレースホルダーを編集します</div>
      </template>

      <template #body>
        <PlaceholderValuesEditor :key="selectedItem.id" :placeholderId="selectedItem.id" />
      </template>
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PlaceholderType } from '@/types'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import IdEditor from '@ConfigComponents/parts/IdEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CopyButton from '@ConfigComponents/parts/CopyButton.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // Pinia store
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
