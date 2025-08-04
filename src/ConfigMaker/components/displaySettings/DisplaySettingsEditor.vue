<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- 表示設定 -->
  <DisplaySettingsCard />

  <!-- GOD-MODEがOFFの時のGODボタン -->
  <div v-if="isDev && !data.displaySettings.developer.godModeEnabled">
   <div class="flex flex-wrap gap-4 p-4">
    <div class="alert alert-warning w-full">
     <Info class="w-5 h-5 mt-0.5 shrink-0" />
     <!-- 開発者モードの有効化 -->
     <SettingItem
      label="開発者モード"
      description="配布されてるほぼすべてのモードに設定可能"
      :showReset="false"
     >
      <label class="label cursor-pointer justify-start gap-3">
       <input
        v-model="data.displaySettings.developer.godModeEnabled"
        type="checkbox"
        class="toggle toggle-warning"
       />
       <span class="label-text"
        >OFFにすると、この「開発者設定」の表示が「警告なしに」消えます</span
       ></label
      >
     </SettingItem>
    </div>
   </div>
  </div>

  <div v-if="data.displaySettings.developer.godModeEnabled">
   <!-- 開発者モード: -->
   <DeveloperSettings />

   <!-- ゲームスクリプトの表示設定: -->
   <AvailableGameScripts />

   <!-- 補足説明 -->
   <div class="flex flex-wrap gap-4 p-4">
    <div class="alert alert-warning w-full">
     <Info class="w-5 h-5 mt-0.5 shrink-0" />
     <div class="space-y-1">
      <p>開発者でもないのにこの開発者モードを見ている方へ：</p>
      <p>やあ(´・ω・｀) このモードを見つけてくれて、ありがとう。</p>
      <p>どうやって見つけたかはわからないけど、自由に設定してみるといい。</p>
      <p>黄色い箇所が【GOD-MODE】で設定できる箇所だ。</p>
      <p>もちろん、君は詳しいだろうから、ノークレーム・ノーリターンで頼むよ。</p>
      <p>...</p>
      <p>あ、そうそう。</p>
      <p>ゲームスクリプト自体の開発は、開発者にしかできないんだ。</p>
      <p>もしも「こういうゲームスクリプトが欲しい」という希望があるなら…</p>
      <p>開発者のPintocuruに要望を出すと良い。頼むよ。</p>
      <p>...</p>
      <p>え、英語版(English mode)が欲しい！？</p>
      <p>要望があったらね…もしよかったら出してみてね。</p>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { isDev } from '@/types/';
import DisplaySettingsCard from './DisplaySettingsCard.vue';
import DeveloperSettings from './DeveloperSettings.vue';
import AvailableGameScripts from './AvailableGameScripts.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';
import { Info } from 'lucide-vue-next';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
</script>
