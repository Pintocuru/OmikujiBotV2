// src/configMaker/components/scriptSettings/useScriptSettings.ts
import { computed } from 'vue'
import { ParameterInputType, ParameterItem } from '@/types/GameScript/GameScriptTypes'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
import { DefaultTypes } from '@shared/types'

export const useScriptSettings = () => {
  const omikujiStore = useOmikujiStore()

  const scriptSettings = computed(() => omikujiStore.data.scriptSettings)

  const updateItem = (scriptId: string, settings: Record<string, any>) => {
    omikujiStore.updateScriptSettings({ [scriptId]: settings })
  }

  const getCurrentSettingValue = (scriptId: string, settingId: string) => {
    const currentSettings = scriptSettings.value[scriptId] as DefaultTypes
    return currentSettings ? currentSettings[settingId] : undefined
  }

  const getInputComponent = (inputType: ParameterInputType) => {
    const components = {
      string: 'input',
      number: 'input',
      boolean: 'input',
      select: 'select',
    }
    return components[inputType] || 'input'
  }

  const getInputProps = (scriptId: string, settingDef: ParameterItem) => {
    const baseProps = {
      value: getCurrentSettingValue(scriptId, settingDef.key),
      class: getInputClass(settingDef.inputType),
    }

    switch (settingDef.inputType) {
      case 'string':
        return { ...baseProps, type: 'text' }

      case 'number':
        return {
          ...baseProps,
          type: 'number',
          min: settingDef.min,
          max: settingDef.max,
        }

      case 'boolean':
        return {
          type: 'checkbox',
          class: 'checkbox',
          checked: getCurrentSettingValue(scriptId, settingDef.key),
        }

      case 'select':
        return {
          ...baseProps,
          class: 'select select-bordered select-sm flex-1',
        }

      default:
        return { ...baseProps, type: 'text' }
    }
  }

  const getInputClass = (inputType: string) => {
    return inputType === 'boolean' ? 'checkbox' : 'input input-bordered input-sm flex-1'
  }

  const updateScriptSetting = (scriptId: string, settingId: string, value: any) => {
    const currentSettings = { ...(scriptSettings.value[scriptId] as DefaultTypes) }
    currentSettings[settingId] = value
    updateItem(scriptId, currentSettings)
  }

  const resetScriptSetting = (scriptId: string, settingId: string) => {
    const scriptPreset = gameScriptMap[scriptId]
    if (!scriptPreset || !scriptPreset.settings) return

    const settingDef = scriptPreset.settings.find((s) => s.key === settingId)
    if (!settingDef) return

    const currentSettings = { ...(scriptSettings.value[scriptId] as DefaultTypes) }
    if (settingDef.defaultValue !== undefined) {
      currentSettings[settingId] = settingDef.defaultValue
    } else {
      delete currentSettings[settingId]
    }
    updateItem(scriptId, currentSettings)
  }

  return {
    scriptSettings,
    getCurrentSettingValue,
    getInputComponent,
    getInputProps,
    updateScriptSetting,
    resetScriptSetting,
  }
}
