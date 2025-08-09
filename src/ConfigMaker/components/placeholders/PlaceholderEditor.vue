<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RecordTabs
  :rules="placeholdersArray"
  :selectedRule="selectedPlaceholder"
  ruleType="placeholders"
  :external-store="extendedStore"
 />

 <!-- プレースホルダー編集エリア -->
 <div v-if="selectedPlaceholder">
  <div class="card bg-base-300 mt-4">
   <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
    <!-- カラーピッカー -->
    <ColorPicker v-model="selectedPlaceholder.editorColor" />
    基本設定
   </div>
   <div class="card-body space-y-3">
    <!-- ID表示とコピー -->
    <SettingItem
     label="ID"
     description="プレースホルダーの一意識別子"
     :showReset="false"
     containerClass="form-control"
    >
     <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
       {{ selectedPlaceholder.id }}
      </div>
      <!-- コピーボタン -->
      <CopyButton
       :value="`<<${selectedPlaceholder.id}>>`"
       dataTip="<<プレースホルダー>>の形式で文字列をコピーします"
      />
      <!-- 編集ボタン -->
      <IdEditor :currentId="selectedPlaceholder.id" category="placeholders" />
     </div>
    </SettingItem>

    <!-- プレースホルダー名 -->
    <SettingItem
     label="設定名"
     description="識別しやすい名前"
     :showReset="false"
     containerClass="form-control"
    >
     <input
      type="text"
      v-model="selectedPlaceholder.name"
      placeholder="設定名を入力"
      class="input input-bordered w-full"
     />
    </SettingItem>
   </div>
  </div>
  <!-- プレースホルダー設定セクション -->
  <div class="card bg-base-300 mt-4">
   <div
    class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center"
   >
    <div class="flex items-center">プレースホルダー設定</div>
    <!-- 抽選テストボタン -->
    <PlaceholderPreview
     v-if="selectedPlaceholder.values.length > 0"
     :id="selectedPlaceholder.id"
     :values="selectedPlaceholder.values"
    />
   </div>
   <div class="card-body">
    <PlaceholderValuesEditor
     :key="selectedPlaceholder.id"
     :placeholderId="selectedPlaceholder.id"
     :isModal="false"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IdEditor from '@ConfigComponents/parts/IdEditor.vue';
import PlaceholderPreview from './PlaceholderPreview.vue';
import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue';
import { usePlaceholderStore } from '@ConfigStores/usePlaceholderStore';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue';
import CopyButton from '@ConfigComponents/parts/CopyButton.vue';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

// ストアを使用
const placeholderStore = usePlaceholderStore();
const omikujiStore = useOmikujiStore();

// RecordTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...placeholderStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('placeholders');
  omikujiStore.selectRule(ruleId);
 }
};

// computed
const placeholdersArray = computed(() => placeholderStore.rulesArray);
const selectedPlaceholder = computed(() => placeholderStore.selectedRule);
</script>
