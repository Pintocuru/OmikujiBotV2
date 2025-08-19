<!-- src/ConfigMaker/components/display/VisibilitySettings.vue -->
<template>
  <div class="card bg-base-300">
    <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">コンポーネント可視性設定</div>
    <div class="card-body space-y-4">
      <!-- 基本コンポーネントの可視性 -->
      <SettingItem
        label="基本コンポーネント表示"
        description="各種コンポーネントの表示・非表示を制御"
        @reset="resetBasicVisibility"
      >
        <div class="grid grid-cols-1 gap-2">
          <label
            v-for="category in recordCategoryLabel"
            :key="category"
            class="label cursor-pointer justify-start gap-3 bg-base-200 p-2 rounded"
          >
            <input v-model="visibilitySettings[category]" type="checkbox" class="toggle toggle-warning toggle-sm" />
            <span class="label-text capitalize">{{ getCategoryDisplayName(category) }}</span>
          </label>
        </div>
      </SettingItem>

      <!-- ゲームスクリプト関連設定 -->
      <SettingItem
        label="ゲームスクリプト設定"
        description="ゲームスクリプト関連の表示制御"
        @reset="resetGameScriptSettings"
      >
        <div class="space-y-3">
          <!-- ゲームスクリプト設定UI表示制御 -->
          <label class="label cursor-pointer justify-start gap-3 bg-base-200 p-3 rounded w-full">
            <input
              v-model="visibilitySettings.gameScriptSettings"
              type="checkbox"
              class="toggle toggle-warning toggle-sm"
            />
            <span class="label-text">ゲームスクリプトの設定UI</span>
          </label>

          <!-- 利用可能なゲームスクリプト -->
          <div class="bg-base-200 p-3 rounded">
            <div class="grid grid-cols-1 gap-2">
              <label
                v-for="(scriptPreset, scriptId) in gameScriptMap"
                :key="scriptId"
                class="label cursor-pointer justify-between p-2 rounded text-sm"
              >
                <span class="font-mono">{{ scriptPreset.name }} / {{ scriptId }}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-warning toggle-sm"
                  :value="scriptId"
                  v-model="gameScriptsArray"
                />
              </label>
            </div>
          </div>
        </div>
      </SettingItem>

      <!-- その他設定 -->
      <SettingItem
        label="ツール系設定"
        description="便利系コンポーネントの表示制御"
        @reset="visibilitySettings.wordPartySettings = true"
      >
        <label class="label cursor-pointer justify-start gap-3 bg-base-200 p-3 rounded w-full">
          <input
            v-model="visibilitySettings.wordPartySettings"
            type="checkbox"
            class="toggle toggle-warning toggle-sm"
          />
          <span class="label-text">WordPartyリスト</span>
        </label>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
  import { storeToRefs } from 'pinia'
  import { categoryLabels, CategoryType, recordCategoryLabel } from '@/types'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 可視性設定の参照
  const visibilitySettings = computed({
    get: () => data.value.displaySettings.developer.visibility,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        developer: {
          ...data.value.displaySettings.developer,
          visibility: newValue,
        },
      })
    },
  })

  // ゲームスクリプト配列の処理
  const gameScriptsArray = computed({
    get: () => visibilitySettings.value.gameScripts,
    set: (newValue: string[]) => {
      visibilitySettings.value = {
        ...visibilitySettings.value,
        gameScripts: newValue,
      }
    },
  })

  // カテゴリ表示名の取得
  function getCategoryDisplayName(category: CategoryType): string {
    return `${categoryLabels[category].label} (${category})`
  }

  // リセット関数
  function resetBasicVisibility() {
    const resetVisibility = { ...visibilitySettings.value }
    recordCategoryLabel.forEach((category) => {
      resetVisibility[category] = true
    })
    visibilitySettings.value = resetVisibility
  }

  function resetGameScriptSettings() {
    visibilitySettings.value = {
      ...visibilitySettings.value,
      gameScripts: [],
      gameScriptSettings: true,
    }
  }
</script>
