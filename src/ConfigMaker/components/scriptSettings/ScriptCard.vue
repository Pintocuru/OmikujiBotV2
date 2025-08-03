<!-- src/configMaker/components/scriptSettings/ScriptCard.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
   {{ scriptPreset.name }} <span class="text-base">(id:{{ scriptPreset.id }})</span>
   <span class="ml-2 cursor-help" :title="scriptPreset.description"> ℹ️ </span>
  </div>

  <div class="card-body">
   <div class="flex justify-between items-start">
    <div class="flex-1">
     <div v-if="!hasSettings" class="text-gray-500 italic">
      このスクリプトには設定可能な項目がありません
     </div>

     <div v-else class="space-y-3">
      <ScriptSettingItem
       v-for="settingDef in scriptPreset.settings"
       :key="settingDef.key"
       :script-id="scriptId"
       :setting-def="settingDef"
      />
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ScriptPreset } from '@/types/';
import ScriptSettingItem from './ScriptSettingItem.vue';

interface Props {
 scriptId: string;
 scriptPreset: ScriptPreset;
}

const props = defineProps<Props>();

const hasSettings = computed(() => {
 return props.scriptPreset.settings && props.scriptPreset.settings.length > 0;
});
</script>
