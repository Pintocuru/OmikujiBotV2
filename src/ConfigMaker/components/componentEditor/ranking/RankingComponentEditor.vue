<!-- src\ConfigMaker\components\componentEditor\ranking\RankingComponentEditor.vue -->
<template>
  <div class="card bg-base-100 p-4 flex flex-col gap-4">
    <!-- ランキングプレビュー -->
    <GameRankingList :botMessages="[]" :settings="ranking" />

    <!-- テーマカラー -->
    <SettingItem
      label="カラー"
      description="ランキングのテーマカラーを選択します"
      :forceMode="'pro'"
      :showReset="true"
      @reset="resetMap.color"
    >
      <select
        class="select select-bordered"
        :value="ranking.color"
        :disabled="!isAdv"
        @change="(e) => updateRankingField('color', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="theme in themes" :key="theme" :value="theme">
          {{ theme }}
        </option>
      </select>
    </SettingItem>

    <!-- 対象スクリプトID -->
    <SettingItem
      label="対象スクリプトID"
      description="ランキング対象のGameScriptを指定します"
      :showReset="true"
      @reset="resetMap.scriptKey"
    >
      <select
        class="select select-bordered w-full"
        :value="ranking.scriptKey ?? ''"
        @change="(e) => updateScriptKey((e.target as HTMLSelectElement).value)"
      >
        <option value="basicList">フキダシリスト</option>
        <option v-for="script in enabledGameScriptMap" :key="script.key" :value="script.key">
          {{ script.name }} (ID: {{ script.key }})
        </option>
      </select>
    </SettingItem>

    <!-- タイトル -->
    <SettingItem
      label="ランキングタイトル"
      description="ランキングのタイトルを設定します"
      :showReset="true"
      @reset="resetMap.title"
    >
      <input
        type="text"
        class="input input-bordered w-full"
        :value="ranking.title"
        @input="(e) => updateRankingField('title', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- 順位のソート -->
    <SettingItem
      label="順位のソート"
      description="得点の高い順・低い順・新しい順から選べます"
      :showReset="true"
      @reset="resetMap.sortOrder"
    >
      <select class="select select-primary" v-model="ranking.sortOrder">
        <option v-for="order in rankingSortOrders" :key="order" :value="order">
          {{ rankingSortOrderLabels[order] }}
        </option>
      </select>
    </SettingItem>

    <!-- 表示するランキング数 -->
    <SettingItem
      label="表示件数"
      description="ランキングに表示する件数を設定します(最大20)"
      :forceMode="'pro'"
      :showReset="true"
      @reset="resetMap.limit"
    >
      <input
        type="number"
        min="1"
        max="20"
        :disabled="!isAdv"
        class="input input-bordered w-24"
        :value="ranking.limit"
        @input="(e) => updateRankingField('limit', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import GameRankingList from '@/MainGenerator/components/GameRanking/GameRankingList.vue'
  import { useEnabledGames } from '@/GameScripts/useEnabledGames'
  import { useSettingMode } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import { rankingSortOrderLabels, rankingSortOrders, SettingsRankingSchema } from '@/types'

  const omikujiStore = useOmikujiStore()
  const { enabledGameScriptMap } = useEnabledGames()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv } = useSettingMode()

  const ranking = computed(() => data.value.components.ranking)

  // 更新関数
  const updateRankingField = (field: keyof typeof ranking.value, value: any) => {
    omikujiStore.updateNestedComponents('ranking', {
      ...ranking.value,
      [field]: value,
    })
  }

  const updateScriptKey = (raw: string) => {
    const value = raw === '' ? null : raw
    updateRankingField('scriptKey', value)
  }

  // リセット関数
  const resetField = (field: keyof typeof ranking.value) => {
    const defaults = SettingsRankingSchema.parse({})
    updateRankingField(field, defaults[field])
  }

  const resetMap = {
    scriptKey: () => resetField('scriptKey'),
    title: () => resetField('title'),
    limit: () => resetField('limit'),
    sortOrder: () => resetField('sortOrder'),
    color: () => resetField('color'),
  }
</script>
