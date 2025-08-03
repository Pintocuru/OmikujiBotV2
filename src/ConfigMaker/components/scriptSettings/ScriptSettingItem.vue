<!-- src/configMaker/components/scriptSettings/ScriptSettingItem.vue -->
<template>
 <SettingItem :label="settingDef.name" :description="settingDef.description" @reset="resetSetting">
  <component :is="inputComponent" v-bind="inputProps" @input="handleInput" @change="handleChange" />
 </SettingItem>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ParameterItem } from '@type/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useScriptSettings } from './useScriptSettings';

interface Props {
 scriptId: string;
 settingDef: ParameterItem;
}

const props = defineProps<Props>();

const { updateScriptSetting, resetScriptSetting, getInputComponent, getInputProps } =
 useScriptSettings();

const inputComponent = computed(() => getInputComponent(props.settingDef.inputType));
const inputProps = computed(() => getInputProps(props.scriptId, props.settingDef));

const handleInput = (event: Event) => {
 const target = event.target as HTMLInputElement;
 let value;

 if (target.type === 'checkbox') {
  value = target.checked;
 } else if (target.type === 'number') {
  value = parseFloat(target.value) || 0;
 } else {
  value = target.value;
 }

 updateScriptSetting(props.scriptId, props.settingDef.key, value);
};

const handleChange = (event: Event) => {
 const target = event.target as HTMLInputElement | HTMLSelectElement;
 let value;

 if (target.type === 'checkbox') {
  value = (target as HTMLInputElement).checked;
 } else {
  value = target.value;
 }

 updateScriptSetting(props.scriptId, props.settingDef.key, value);
};

const resetSetting = () => {
 resetScriptSetting(props.scriptId, props.settingDef.key);
};
</script>
