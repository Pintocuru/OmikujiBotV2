<!-- src/ConfigMaker/components/meta/PackageMetaEditor.vue -->
<template>
 <div class="space-y-4">
  <div class="card bg-base-300">
   <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">パッケージメタ情報</div>
   <div class="card-body space-y-4">
    <!-- パッケージ名 -->
    <SettingItem
     label="パッケージ名"
     description="パッケージの表示名を設定します"
     @reset="resetMap.name"
    >
     <input
      v-model="meta.name"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="パッケージ名を入力"
     />
    </SettingItem>

    <!-- パッケージ説明 -->
    <SettingItem
     label="パッケージ説明"
     description="パッケージの詳細説明を設定します"
     @reset="resetMap.description"
    >
     <textarea
      v-model="meta.description"
      class="textarea textarea-bordered w-full max-w-md h-20"
      placeholder="パッケージの説明を入力"
     ></textarea>
    </SettingItem>

    <!-- バージョン -->
    <SettingItem
     label="バージョン"
     description="パッケージのバージョン情報"
     @reset="resetMap.version"
    >
     <input
      v-model="meta.version"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="例: 1.0.0"
     />
    </SettingItem>

    <!-- ジェネレータ名 -->
    <SettingItem
     label="対応アプリ名"
     description="このパッケージを生成したアプリケーション名"
     @reset="resetMap.generatorName"
    >
     <input
      v-model="meta.generatorName"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="アプリケーション名"
     />
    </SettingItem>

    <!-- ジェネレータバージョン -->
    <SettingItem
     label="アプリバージョン"
     description="対応アプリケーションのバージョン"
     @reset="resetMap.generatorVersion"
    >
     <input
      v-model="meta.generatorVersion"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="例: 1.x.x"
     />
    </SettingItem>

    <!-- 作者 -->
    <SettingItem label="作者" description="パッケージの作成者名" @reset="resetMap.author">
     <input
      v-model="meta.author"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="作者名を入力"
     />
    </SettingItem>

    <!-- タグ -->
    <SettingItem
     label="タグ"
     description="パッケージの分類に使用されるタグ（カンマ区切りで入力）"
     @reset="resetMap.tags"
    >
     <input
      v-model="tagsInput"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="例: ゲーム, エンターテイメント, 配信"
     />
    </SettingItem>

    <!-- ライセンス -->
    <SettingItem
     label="ライセンス"
     description="パッケージのライセンス情報"
     @reset="resetMap.license"
    >
     <input
      v-model="meta.license"
      type="text"
      class="input input-bordered w-full max-w-md"
      placeholder="例: CC-BY 4.0"
     />
    </SettingItem>

    <!-- URL -->
    <SettingItem
     label="配布サイトURL"
     description="パッケージの配布サイトやプロジェクトページのURL（任意）"
     @reset="resetMap.url"
    >
     <input
      v-model="meta.url"
      type="url"
      class="input input-bordered w-full max-w-md"
      placeholder="https://example.com"
     />
    </SettingItem>

    <!-- ID (読み取り専用) -->
    <SettingItem
     label="パッケージID"
     description="パッケージの一意識別子（自動生成・読み取り専用）"
     :showReset="false"
    >
     <input
      :value="meta.id"
      type="text"
      class="input input-bordered w-full max-w-md bg-base-200"
      readonly
     />
    </SettingItem>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PackageMetaSchema } from '@shared/types';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// メタ情報の参照
const meta = computed({
 get: () => data.value.meta,
 set: (newValue) => {
  omikujiStore.updateMeta(newValue);
 }
});

// タグの文字列とテキスト入力の相互変換
const tagsInput = computed({
 get: () => meta.value.tags.join(', '),
 set: (value: string) => {
  const tags = value
   .split(',')
   .map((tag) => tag.trim())
   .filter((tag) => tag.length > 0);
  meta.value = {
   ...meta.value,
   tags
  };
 }
});

// 共通リセット関数
const resetField = (field: keyof typeof meta.value) => {
 const defaultSchema = PackageMetaSchema.shape[field];
 let defaultValue;

 // デフォルト値の取得
 if (field === 'url') {
  // urlは任意フィールドなのでundefinedをデフォルトとする
  defaultValue = undefined;
 } else {
  // その他のフィールドはschemaのデフォルト値を使用
  defaultValue = defaultSchema.parse(undefined);
 }

 meta.value = {
  ...meta.value,
  [field]: defaultValue
 };
};

// フィールドごとのショートカット
const resetMap = {
 name: () => resetField('name'),
 description: () => resetField('description'),
 version: () => resetField('version'),
 generatorName: () => resetField('generatorName'),
 generatorVersion: () => resetField('generatorVersion'),
 author: () => resetField('author'),
 tags: () => resetField('tags'),
 license: () => resetField('license'),
 url: () => resetField('url')
};
</script>
