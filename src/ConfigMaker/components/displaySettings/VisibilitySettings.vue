<!-- src/ConfigMaker/components/display/VisibilitySettings.vue -->
<template>
  <SectionCard variant="warning">
    <template #header>
      <div>コンポーネント可視性設定</div>
      <div class="text-sm pr-2">見えるのか…私が…！</div>
    </template>

    <template #body>
      <!-- 基本コンポーネントの可視性 -->
      <SettingItem label="基本コンポーネント表示" description="各種コンポーネントの表示・非表示を制御">
        <div class="grid grid-cols-1 gap-2">
          <div v-for="category in recordCategoryLabel" :key="category" class="bg-base-200 p-3 rounded">
            <div class="flex items-center justify-between mb-2">
              <span class="label-text font-medium capitalize">{{ getCategoryDisplayName(category) }}</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
                <input
                  v-model="visibilitySettings[category]"
                  :value="level"
                  type="radio"
                  class="radio radio-warning radio-sm"
                />
                <span class="label-text capitalize">{{ level }}</span>
              </label>
            </div>
          </div>
        </div>
      </SettingItem>

      <!-- コンポーネント固有の可視性設定 -->
      <SettingItem label="コンポーネント固有設定" description="特定コンポーネント内の要素の表示制御">
        <div class="space-y-3">
          <!-- characterVisible設定 -->
          <div class="bg-base-200 p-3 rounded">
            <div class="flex items-center justify-between mb-2">
              <span class="label-text font-medium">キャラクター表示 (characterVisible)</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
                <input
                  v-model="visibilitySettings.characterVisible"
                  :value="level"
                  type="radio"
                  class="radio radio-warning radio-sm"
                />
                <span class="label-text capitalize">{{ level }}</span>
              </label>
            </div>
          </div>

          <!-- wordPartyLoading設定 -->
          <div class="bg-base-200 p-3 rounded">
            <div class="flex items-center justify-between mb-2">
              <span class="label-text font-medium">WordParty読み込み機能 (wordPartyLoading)</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
                <input
                  v-model="visibilitySettings.wordPartyLoading"
                  :value="level"
                  type="radio"
                  class="radio radio-warning radio-sm"
                />
                <span class="label-text capitalize">{{ level }}</span>
              </label>
            </div>
          </div>
        </div>
      </SettingItem>

      <!-- ゲームスクリプト関連設定 -->
      <SettingItem label="ゲームスクリプト設定" description="ゲームスクリプト関連の表示制御">
        <div class="space-y-3">
          <!-- ゲームスクリプト設定UI表示制御 -->
          <div class="bg-base-200 p-3 rounded">
            <div class="flex items-center justify-between mb-2">
              <span class="label-text font-medium">ゲームスクリプトの設定UI</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
                <input
                  v-model="visibilitySettings.gameScriptSettings"
                  :value="level"
                  type="radio"
                  class="radio radio-warning radio-sm"
                />
                <span class="label-text capitalize">{{ level }}</span>
              </label>
            </div>
          </div>

          <!-- 利用可能なゲームスクリプト -->
          <div class="bg-base-200 p-3 rounded">
            <div class="mb-2">
              <span class="label-text font-medium">利用可能なゲームスクリプト</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <label
                v-for="(scriptPreset, scriptId) in gameScriptMap"
                :key="scriptId"
                class="label cursor-pointer justify-between p-2 rounded text-sm bg-base-300"
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
      <SettingItem label="ツール系設定" description="便利系コンポーネントの表示制御">
        <div class="bg-base-200 p-3 rounded">
          <div class="flex items-center justify-between mb-2">
            <span class="label-text font-medium">WordPartyリスト</span>
          </div>
          <div class="flex gap-2 flex-wrap">
            <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
              <input
                v-model="visibilitySettings.wordPartySettings"
                :value="level"
                type="radio"
                class="radio radio-warning radio-sm"
              />
              <span class="label-text capitalize">{{ level }}</span>
            </label>
          </div>
        </div>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
  import { storeToRefs } from 'pinia'
  import { categoryLabels, CategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
  import { AccessLevelLabels, AccessLevelType } from '@shared/types'

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
</script>
