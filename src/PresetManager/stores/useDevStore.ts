// src/PresetManager/stores/useDevStore.ts
import { defineStore } from 'pinia'
import { useDevConfigState } from './useDevConfigState'
import { useDevConfigActions } from './useDevConfigActions'
import { useDevConfigGetters } from './useDevConfigGetters'

export const useDevStore = defineStore('devConfig', () => {
  // 状態管理
  const state = useDevConfigState()

  // アクション
  const actions = useDevConfigActions(state)

  // ゲッター
  const getters = useDevConfigGetters(state)

  return {
    ...state,
    ...getters,
    ...actions,
  }
})
