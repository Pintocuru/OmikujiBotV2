<!-- src/configMaker/components/wordPartySettings/WordPartySettingsEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- テキストエディタ -->
  <TextEditor
   v-model="textEditorContent"
   :settings="wordPartySetting"
   @save="saveTextEdit"
   @reset="resetTextEdit"
  />

  <!-- WordParty発火リスト -->
  <FireList :settings="wordPartySetting" />

  <!-- 開発者モード -->
  <DeveloperMode
   :agreed="developerModeAgreed"
   :load-status="loadStatus"
   @agree="agreeToDeveloperMode"
   @load="handleFileLoad"
  />
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { WordPartySettings } from '@/types/';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';
import TextEditor from '@ConfigComponents/wordPartySettings/TextEditor.vue';
import FireList from '@ConfigComponents/wordPartySettings/FireList.vue';
import DeveloperMode from '@ConfigComponents/wordPartySettings/DeveloperMode.vue';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照 (computed with get/set)
const wordPartySetting = computed({
 get: () => data.value.wordPartySettings,
 set: (value: WordPartySettings[]) => {
  data.value.wordPartySettings = value;
 }
});

// 開発者モード関連
const developerModeAgreed = ref(false);
const loadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null);

// テキストエディタ関連
const textEditorContent = ref('');

// 設定を簡潔な形式に変換
function settingsToSimpleFormat(settings: WordPartySettings[]): string {
 return settings.map((item) => `${item.name},${item.pattern}`).join('\n');
}

// 簡潔な形式から設定に変換
function simpleFormatToSettings(text: string): WordPartySettings[] {
 return text
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line) => {
   const commaIndex = line.indexOf(',');
   if (commaIndex === -1) return null;
   return {
    name: line.substring(0, commaIndex).trim(),
    pattern: line.substring(commaIndex + 1).trim()
   };
  })
  .filter((item) => item !== null) as WordPartySettings[];
}

// 初期化時にテキストエディタに現在の設定を表示
textEditorContent.value = settingsToSimpleFormat(wordPartySetting.value);

// wordPartySettingが変更されたときにテキストエディタも更新
watch(
 wordPartySetting,
 (newValue) => {
  textEditorContent.value = settingsToSimpleFormat(newValue);
 },
 { deep: true }
);

// 開発者モード同意
function agreeToDeveloperMode() {
 developerModeAgreed.value = true;
}

// ファイル読み込み処理
function handleFileLoad(content: string) {
 const tempLoadedSettings: { name: string; pattern: string[] | string }[] = [];

 // WordParty の setup をハイジャック
 (window as any).WordParty = {
  init(config: any) {
   return {
    setup(setups: any[]) {
     tempLoadedSettings.push(
      ...setups.map((s) => ({
       name: s.name ?? '',
       pattern: s.pattern ?? []
      }))
     );
     return { start() {} };
    }
   };
  }
 };

 try {
  new Function(content)(); // eval 相当
  if (tempLoadedSettings.length > 0) {
   // string[]をstringに変換して即時適用
   const currentSettings = [...wordPartySetting.value];

   // 正規表現の前後のメタ文字（^ や $、空白文字など）を除去するヘルパー関数
   const cleanPatternBoundaries = (rawPattern: string): string => {
    // 文字列の先頭にある '^' や空白文字、および文字列の末尾にある '$' や空白文字を除去
    return rawPattern.replace(/^[\^\s]+|[\$\s]+$/g, '');
   };

   tempLoadedSettings.forEach((loaded) => {
    const patterns = Array.isArray(loaded.pattern) ? loaded.pattern : [loaded.pattern];

    patterns.forEach((pattern) => {
     // ここで正規表現の前後のメタ文字と空白文字を除去
     const cleanedPattern = cleanPatternBoundaries(pattern);

     const existingIndex = currentSettings.findIndex(
      (existing) => existing.name === loaded.name && existing.pattern === cleanedPattern
     );
     const newSetting: WordPartySettings = {
      name: loaded.name,
      pattern: cleanedPattern // クリーンアップされたパターンを使用
     };

     if (existingIndex === -1) {
      // 新しい設定を追加（重複チェック）
      currentSettings.push(newSetting);
     }
    });
   });

   // computedのsetterを使用して保存
   wordPartySetting.value = currentSettings;

   loadStatus.value = {
    type: 'success',
    message: `${tempLoadedSettings.length}件の設定を読み込み、適用しました`
   };
  } else {
   loadStatus.value = {
    type: 'error',
    message: '読み込めませんでした - 有効な設定が見つかりません'
   };
  }
 } catch (e) {
  loadStatus.value = {
   type: 'error',
   message: `読み込めませんでした - ${e}`
  };
 }
}

// テキスト編集保存
function saveTextEdit() {
 try {
  const validSettings = simpleFormatToSettings(textEditorContent.value);
  wordPartySetting.value = validSettings;
 } catch (e) {
  alert('形式が正しくありません: ' + e);
 }
}

// テキスト編集リセット
function resetTextEdit() {
 textEditorContent.value = settingsToSimpleFormat(wordPartySetting.value);
}
</script>
