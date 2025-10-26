// src/ConfigMaker/composables/useClassGenerator.ts
import { reactive } from 'vue'

export interface Settings {
  paddingX: number
  paddingY: number
  borderWidth: string
  borderColor: string
  borderRadius: string
  customClasses: string
}

export interface Preset {
  label: string
  classes: string
}

export const PRESETS: Preset[] = [
  { label: 'デフォルト', classes: 'px-4 py-4 rounded-xl' },
  { label: 'ラウンド', classes: 'px-8 py-2 rounded-full' },
  { label: 'カード', classes: 'px-6 py-6 mt-2 border border-white rounded-md' },
  { label: 'ボタン', classes: 'px-6 py-2 border-2 border-white rounded-md' },
  { label: 'ミニマル', classes: 'px-2 py-2 rounded-none' },
]

export const BORDER_WIDTH_OPTIONS = [
  { label: 'なし', value: 'border-0' },
  { label: '1px', value: 'border' },
  { label: '2px', value: 'border-2' },
  { label: '4px', value: 'border-4' },
]

export const BORDER_COLOR_OPTIONS = [
  { label: '白', value: 'border-white' },
  { label: '黒', value: 'border-black' },
]

export const BORDER_RADIUS_OPTIONS = [
  { label: 'なし', value: 'rounded-none' },
  { label: '標準', value: 'rounded-md' },
  { label: '大', value: 'rounded-xl' },
  { label: 'Full', value: 'rounded-full' },
]

export function useClassGenerator(emit: (event: 'update:modelValue', value: string) => void) {
  const settings = reactive<Settings>({
    paddingX: 4,
    paddingY: 4,
    borderWidth: 'border',
    borderColor: 'border-white',
    borderRadius: 'rounded-xl',
    customClasses: '',
  })

  const generateClasses = (): string => {
    const classes: string[] = []

    if (settings.paddingX > 0) classes.push(`px-${settings.paddingX}`)
    if (settings.paddingY > 0) classes.push(`py-${settings.paddingY}`)

    if (settings.borderWidth !== 'border-0') {
      classes.push(settings.borderWidth, settings.borderColor)
    }

    if (settings.borderRadius !== 'rounded-none') {
      classes.push(settings.borderRadius)
    }

    if (settings.customClasses.trim()) {
      classes.push(settings.customClasses.trim())
    }

    return classes.filter(Boolean).join(' ')
  }

  const updateClasses = () => emit('update:modelValue', generateClasses())

  const parseClasses = (classString: string) => {
    const classes = classString.split(' ')
    const parsers: Record<string, (cls: string) => void> = {
      'px-': (cls) => (settings.paddingX = parseInt(cls.replace('px-', '')) || 0),
      'py-': (cls) => (settings.paddingY = parseInt(cls.replace('py-', '')) || 0),
      border: (cls) => {
        if (['border', 'border-2', 'border-4'].includes(cls)) settings.borderWidth = cls
        else if (['border-white', 'border-black'].includes(cls)) settings.borderColor = cls
      },
      rounded: (cls) => (settings.borderRadius = cls),
    }

    // Reset
    Object.assign(settings, {
      paddingX: 0,
      paddingY: 0,
      borderWidth: 'border-0',
      borderColor: 'border-white',
      borderRadius: 'rounded-none',
      customClasses: '',
    })

    classes.forEach((cls) => {
      const parser = Object.keys(parsers).find((key) => cls.startsWith(key))
      if (parser) parsers[parser](cls)
    })
  }

  const applyPreset = (classes: string) => {
    parseClasses(classes)
    updateClasses()
  }

  return {
    settings,
    generateClasses,
    updateClasses,
    parseClasses,
    applyPreset,
  }
}
