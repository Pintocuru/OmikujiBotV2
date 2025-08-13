<!-- src/ConfigMaker/components/meta/PackageDistributionInfo.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">配布情報</div>
  <div class="card-body space-y-4">
   <!-- ライセンス -->
   <SettingItem
    label="ライセンス"
    description="パッケージのライセンス情報"
    @reset="resetMap.license"
   >
    <div class="flex gap-2">
     <select v-model="meta.license" class="select select-bordered flex-1 max-w-xs">
      <option v-for="license in licenseOptions" :key="license.value" :value="license.value">
       {{ license.label }}
      </option>
     </select>
     <input
      v-if="meta.license === 'custom'"
      v-model="customLicense"
      type="text"
      class="input input-bordered flex-1 max-w-xs"
      placeholder="カスタムライセンスを入力"
     />
    </div>
   </SettingItem>

   <!-- URL -->
   <SettingItem
    label="配布サイトURL"
    description="パッケージの配布サイトやプロジェクトページのURL（任意）"
    @reset="resetMap.url"
   >
    <div class="flex gap-2">
     <input
      v-model="meta.url"
      type="url"
      class="input input-bordered flex-1 max-w-md"
      placeholder="https://example.com"
     />
     <button
      v-if="meta.url && isValidUrl(meta.url)"
      @click="openUrl"
      class="btn btn-primary btn-outline"
      title="サイトを開く"
     >
      <ExternalLink class="w-4 h-4" />
     </button>
    </div>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PackageMetaSchema } from '@omiken/shared/types';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { storeToRefs } from 'pinia';
import { ExternalLink } from 'lucide-vue-next';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// ライセンス選択肢（BOOTHでよく使われるもの）
const licenseOptions = [
 { value: 'CC-BY 4.0', label: 'CC-BY 4.0 (表示)' },
 { value: 'CC-BY-SA 4.0', label: 'CC-BY-SA 4.0 (表示-継承)' },
 { value: 'CC-BY-NC 4.0', label: 'CC-BY-NC 4.0 (表示-非営利)' },
 { value: 'CC-BY-NC-SA 4.0', label: 'CC-BY-NC-SA 4.0 (表示-非営利-継承)' },
 { value: 'CC-BY-NC-ND 4.0', label: 'CC-BY-NC-ND 4.0 (表示-非営利-改変禁止)' },
 { value: 'CC0 1.0', label: 'CC0 1.0 (パブリックドメイン)' },
 { value: '利用規約に従う', label: '利用規約に従う' },
 { value: '個人利用のみ', label: '個人利用のみ' },
 { value: '商用利用可', label: '商用利用可' },
 { value: '改変禁止', label: '改変禁止' },
 { value: '要相談', label: '要相談' },
 { value: 'custom', label: 'カスタム' }
];

// メタ情報の参照
const meta = computed({
 get: () => data.value.meta,
 set: (newValue) => {
  omikujiStore.updateMeta(newValue);
 }
});

// カスタムライセンス用の入力
const customLicense = computed({
 get: () => {
  if (!licenseOptions.some((option) => option.value === meta.value.license)) {
   return meta.value.license;
  }
  return '';
 },
 set: (value: string) => {
  meta.value = {
   ...meta.value,
   license: value
  };
 }
});

// URL検証
const isValidUrl = (url: string): boolean => {
 try {
  new URL(url);
  return true;
 } catch {
  return false;
 }
};

// URLを開く
const openUrl = () => {
 if (meta.value.url && isValidUrl(meta.value.url)) {
  window.open(meta.value.url, '_blank', 'noopener,noreferrer');
 }
};

// 共通リセット関数
const resetField = (field: keyof typeof meta.value) => {
 let defaultValue;

 if (field === 'url') {
  defaultValue = undefined;
 } else {
  defaultValue = PackageMetaSchema.shape[field].parse(undefined);
 }

 meta.value = {
  ...meta.value,
  [field]: defaultValue
 };
};

// フィールドごとのショートカット
const resetMap = {
 license: () => resetField('license'),
 url: () => resetField('url')
};
</script>
