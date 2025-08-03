<!-- src/ConfigMaker/components/display/DisplaySettingsCard.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">表示設定</div>
  <div class="card-body space-y-4">
   <!-- 表示サイズ -->
   <SettingItem
    label="表示サイズ"
    description="コンテンツの表示サイズを設定します"
    @reset="resetDisplaySize"
   >
    <select v-model="displaySettings.displaySize" class="select select-bordered w-full max-w-xs">
     <option v-for="size in displaySizeOptions" :key="size" :value="size">
      {{ displaySizeLabels[size] }}
     </option>
    </select>
   </SettingItem>

   <!-- トースト表示 -->
   <SettingItem
    label="トースト通知"
    description="通知メッセージを表示するかどうか"
    @reset="resetToastEnabled"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.toastEnabled"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">トースト通知を表示する</span>
    </label>
   </SettingItem>

   <!-- キャラクターコントロールパネル -->
   <SettingItem
    label="コントロールパネル"
    description="キャラクターコントロールパネルの表示設定"
    @reset="resetHideModeSwitch"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.modeSwitchEnabled"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">キャラクターコントロールパネルを表示する</span>
    </label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DisplaySettingsSchema } from '@/types';
import { displaySize, displaySizeLabels, DisplaySize } from '@shared/types';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const displaySettings = computed(() => data.value.displaySettings);

// 選択肢の定義
const displaySizeOptions: DisplaySize[] = [...displaySize];

// リセット機能（スキーマのデフォルト値を使用）
const resetDisplaySize = () => {
 displaySettings.value.displaySize = DisplaySettingsSchema.shape.displaySize.parse(undefined);
};

const resetToastEnabled = () => {
 displaySettings.value.toastEnabled = DisplaySettingsSchema.shape.toastEnabled.parse(undefined);
};

const resetHideModeSwitch = () => {
 displaySettings.value.modeSwitchEnabled =
  DisplaySettingsSchema.shape.modeSwitchEnabled.parse(undefined);
};
</script>
