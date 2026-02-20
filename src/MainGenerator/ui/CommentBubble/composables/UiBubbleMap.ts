// src/MainGenerator/ui/CommentBubble/composables/UiBubbleMap.ts
import { CharacterColorType } from '@/types'

type UiMapOptions = {
  color: CharacterColorType
  brightness?: string
  customClasses?: string
  customArrowClasses?: string
}

export function createUiMap({ brightness, color, customClasses, customArrowClasses }: UiMapOptions) {
  const isTheme = color?.isTheme ?? false
  const bgColor = color?.backgroundColor || '#212121'

  return {
    themeDataAttr: isTheme ? color.daisyUiTheme : null,

    bubble: {
      class: [
        customClasses,
        brightness,
        ...(isTheme
          ? [`text-${color.backFrom}-content`, 'bg-gradient-to-br', `from-${color.backFrom}`, `to-${color.backTo}`]
          : []),
      ],
      style: isTheme
        ? {}
        : {
            backgroundColor: bgColor,
            '--bubble-bg': bgColor,
          },
    },

    name: {
      class: isTheme ? 'badge mb-2 text-base-content' : '',
      style: isTheme ? {} : { color: color?.nameColor || '#ccc' },
    },

    text: {
      class: brightness,
      style: isTheme ? {} : { color: color?.textColor || '#ccc' },
    },

    arrow: {
      class: [customArrowClasses, brightness, ...(isTheme ? [`border-t-${color.backTo}`] : [])],
      style: isTheme ? {} : { borderTopColor: 'var(--bubble-bg)' },
    },
  }
}
