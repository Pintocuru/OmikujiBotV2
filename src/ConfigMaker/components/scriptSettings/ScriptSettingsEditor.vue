<!-- src/configMaker/components/scriptSettings/ScriptSettingsEditor.vue -->
<template>
 <div v-if="hasScripts">
  <ScriptCard
   v-for="scriptId in availableGameScripts.filter((key) => key in gameScriptMap)"
   :key="scriptId"
   :script-id="scriptId"
   :script-preset="gameScriptMap[scriptId]"
  />
 </div>
 <div v-else>
  <!-- 補足説明 -->
  <div class="flex flex-wrap gap-4 p-4">
   <div class="alert alert-info w-full">
    <Settings class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
     <p>利用可能なゲームスクリプトがありません</p>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap';
import ScriptCard from './ScriptCard.vue';
import { useScriptSettingsCleanup } from './useScriptSettingsCleanup';
import { Settings } from 'lucide-vue-next';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

const availableGameScripts = data.value.displaySettings.developer.availableGameScripts ?? [];

const hasScripts = computed(() => availableGameScripts.some((key) => key in gameScriptMap));

onMounted(() => {
 useScriptSettingsCleanup().cleanupScriptSettings();
});
</script>
