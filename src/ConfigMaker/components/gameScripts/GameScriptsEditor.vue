<!-- src\ConfigMaker\components\gameScripts\GameScriptsEditor.vue -->
<template>
  <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
    <!-- 左側: プレビューエリア -->
    <div class="col-span-1 min-w-48">
      <GameScriptPreview :gameScripts="gameScripts" />
    </div>

    <!-- 右側: 設定エリア -->
    <div class="col-span-2 space-y-4">
      <!-- Script ID -->
      <div v-if="gameScriptMap[gameScripts.scriptId]?.banner">
        <img :src="gameScriptMap[gameScripts.scriptId]?.banner" alt="banner" class="w-full rounded-lg shadow" />
      </div>
      <div v-if="gameScriptMap[gameScripts.scriptId]?.url">
        <p class="text-sm">
          スクリプトクエリのチートシートはこちら →
          <a :href="gameScriptMap[gameScripts.scriptId].url" target="_blank" class="link link-primary">
            紹介ページを開く
          </a>
        </p>
      </div>

      <!-- Script ID -->
      <SettingItem
        label="スクリプトID"
        description="実行するスクリプトを選択"
        :variant="isScriptIdEmpty ? 'warning' : undefined"
        :showWarning="isScriptIdEmpty"
      >
        <select
          :value="gameScripts.scriptId"
          @change="updateScriptId(($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm w-full"
          :disabled="!hasAvailableScripts"
        >
          <option value="">
            {{ hasAvailableScripts ? '-- スクリプトを選択 --' : '-- 利用可能なスクリプトがありません --' }}
          </option>
          <option v-for="scriptKey in availableGameScripts" :key="scriptKey" :value="scriptKey">
            {{ getScriptName(scriptKey) }}
          </option>
        </select>
      </SettingItem>

      <!-- 利用可能なスクリプトがない場合の警告 -->
      <div v-if="!hasAvailableScripts" class="alert alert-warning text-sm">
        <div class="flex flex-col gap-1">
          <span class="font-semibold">利用可能なゲームスクリプトがありません</span>
          <span class="text-xs opacity-80"> 機能設定でゲームスクリプトを有効化してください </span>
        </div>
      </div>

      <!-- Script Params -->
      <SettingItem label="スクリプトクエリ" description="スクリプトに渡す追加クエリ">
        <input
          type="text"
          :value="gameScripts.queryString"
          @input="updateQueryString(($event.target as HTMLInputElement).value)"
          placeholder="例: mode=スイカ&tlife=3"
          class="input input-bordered input-sm w-full"
          :disabled="!hasAvailableScripts"
        />
      </SettingItem>

      <!-- Character Key -->
      <SettingItem
        v-if="isCharacter"
        label="キャラクターキー"
        description="スクリプト実行時に使用するキャラクター"
        :variant="isCharacterKeyEmpty ? 'warning' : undefined"
        :showWarning="isCharacterKeyEmpty"
      >
        <select
          :value="gameScripts.characterKey"
          @change="updateCharacterKey(($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm w-full"
          :disabled="!hasAvailableScripts"
        >
          <option value="">-- キャラクターを選択 --</option>
          <option v-for="character in charactersList" :key="character.key" :value="character.key">
            {{ character.name }}
          </option>
        </select>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType } from '@/types/OmikujiData/'
  import GameScriptPreview from './GameScriptPreview.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { gameScriptMap } from '@game/GameScriptsMap'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    index: number
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const { data, updateOmikujiByIndex } = useOmikujiStore()
  const { getCategoryArray, getItem } = useGetRecordData()
  const { isCharacter } = useVisibilityAccess()

  // Computed Properties
  const availableGameScripts = computed(() => data.featureUsage.gameScripts)
  const hasAvailableScripts = computed(() => availableGameScripts.value.length > 0)
  const charactersList = computed(() => getCategoryArray('characters'))

  const omikujiSets = computed(() => {
    if (!props.selectedItemKey) return []
    const record = getItem(props.category, props.selectedItemKey)
    return record?.omikuji || []
  })

  const omikujiItem = computed(() => omikujiSets.value[props.index] || null)
  const gameScripts = computed(
    () => omikujiItem.value?.gameScripts || { scriptId: '', queryString: '', characterKey: '' }
  )

  const isScriptIdEmpty = computed(() => gameScripts.value.scriptId === '')
  const isCharacterKeyEmpty = computed(() => gameScripts.value.characterKey === '')

  // Helper Functions
  const getScriptName = (scriptKey: string): string => {
    const script = gameScriptMap[scriptKey]
    return script?.name || scriptKey
  }

  const updateGameScripts = (updater: (current: typeof gameScripts.value) => Partial<typeof gameScripts.value>) => {
    if (props.index === -1 || !props.selectedItemKey) return

    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      gameScripts: {
        ...item.gameScripts,
        ...updater(item.gameScripts),
      },
    }))
  }

  // Update Functions
  const updateScriptId = (value: string) => {
    updateGameScripts(() => ({ scriptId: value || '' }))
  }

  const updateCharacterKey = (value: string) => {
    updateGameScripts(() => ({ characterKey: value }))
  }

  const updateQueryString = (value: string) => {
    updateGameScripts(() => ({ queryString: value }))
  }
</script>
