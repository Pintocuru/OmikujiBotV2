<!-- src/configMaker/components/scriptSettings/ScriptSettingsEditor.vue -->
<template>
 <div v-if="hasScripts">
  <ScriptCard
   v-for="(scriptPreset, scriptId) in scriptGameMap"
   :key="scriptId"
   :script-id="scriptId"
   :script-preset="scriptPreset"
  />
 </div>
 <div v-else>
  <div class="text-center py-8 text-gray-500">
   <Settings class="w-12 h-12 mx-auto mb-2 opacity-50" />
   <p>利用可能なスクリプトがありません</p>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import ScriptCard from './ScriptCard.vue';
import { useScriptSettingsCleanup } from './useScriptSettingsCleanup';
import { Settings } from 'lucide-vue-next';

const { cleanupScriptSettings } = useScriptSettingsCleanup();

const hasScripts = computed(() => Object.keys(scriptGameMap).length !== 0);

onMounted(() => {
 cleanupScriptSettings();
});
</script>
