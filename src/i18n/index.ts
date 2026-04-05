// src/i18n/index.ts
import i18next from 'i18next'
import ja from './ja.json'
import en from './en.json'

i18next.init({
  lng: 'ja',
  fallbackLng: 'ja',
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
})

export const t = i18next.t.bind(i18next)
export default i18next
