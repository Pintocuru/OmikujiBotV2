<!-- src/configMaker/components/scriptSettings/ScriptCard.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>
        {{ scriptPreset.name }} <span class="text-base">(id:{{ scriptPreset.id }})</span>
      </div>
      <div class="text-sm pr-2">{{ scriptPreset.description }}</div>
    </template>

    <template #body>
      <div v-if="hasSettings">
        <SettingItem
          v-for="settingDef in scriptPreset.settings"
          :key="settingDef.key"
          :label="settingDef.name"
          :description="settingDef.description"
          @reset="resetSetting(settingDef.key)"
        >
          <component
            :is="getInputComponent(settingDef.inputType)"
            v-bind="getInputProps(scriptId, settingDef)"
            @input="handleInput($event, settingDef.key)"
            @change="handleChange($event, settingDef.key)"
          />
        </SettingItem>
      </div>
      <div v-else class="text-gray-500 italic">このスクリプトには設定可能な項目がありません</div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useScriptSettings } from './useScriptSettings'

  const props = defineProps<{
    scriptId: string
    scriptPreset: ScriptPreset
  }>()

  const { updateScriptSetting, resetScriptSetting, getInputComponent, getInputProps } = useScriptSettings()

  const hasSettings = computed(() => {
    return props.scriptPreset.settings && props.scriptPreset.settings.length > 0
  })

  const handleInput = (event: Event, settingKey: string) => {
    const target = event.target as HTMLInputElement
    let value

    if (target.type === 'checkbox') {
      value = target.checked
    } else if (target.type === 'number') {
      value = parseFloat(target.value) || 0
    } else {
      value = target.value
    }

    updateScriptSetting(props.scriptId, settingKey, value)
  }

  const handleChange = (event: Event, settingKey: string) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement
    let value

    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked
    } else {
      value = target.value
    }

    updateScriptSetting(props.scriptId, settingKey, value)
  }

  const resetSetting = (settingKey: string) => {
    resetScriptSetting(props.scriptId, settingKey)
  }
</script>
