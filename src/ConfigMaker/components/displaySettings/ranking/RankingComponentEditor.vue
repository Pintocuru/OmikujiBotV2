<!-- src\ConfigMaker\components\displaySettings\components\RankingComponentEditor.vue -->
<template>
  <div class="card bg-base-100 p-4 flex flex-col gap-4">
    <!-- ランキングプレビュー -->
    <GameRankingList :botMessages="[]" :settings="ranking" />

    <SettingItem
      label="対象スクリプトID"
      description="ランキング対象のGameScriptを指定します"
      :showReset="true"
      @reset="resetMap.scriptKey"
    >
      <select
        class="select select-bordered w-full"
        :value="ranking.scriptKey || ''"
        @change="(e) => updateRankingField('scriptKey', (e.target as HTMLSelectElement).value || null)"
      >
        <option :value="null">-- 未選択 --</option>

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

    <!-- 表示するランキング数 -->
    <SettingItem
      label="表示件数"
      description="ランキングに表示する件数を設定します"
      :showReset="true"
      @reset="resetMap.limit"
    >
      <input
        type="number"
        min="1"
        max="100"
        class="input input-bordered w-24"
        :value="ranking.limit"
        @input="(e) => updateRankingField('limit', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <!-- 順位のソート -->
    <SettingItem
      label="順位のソート"
      description="ランキング向けに得点の高い順にするか"
      :showReset="true"
      @reset="resetMap.sortByHighScore"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="ranking.sortByHighScore"
        @change="(e) => updateRankingField('sortByHighScore', (e.target as HTMLInputElement).checked)"
      />
    </SettingItem>

    <!-- テーマカラー -->
    <SettingItem
      label="カラー"
      description="ランキングのテーマカラーを選択します"
      :showReset="true"
      @reset="resetMap.color"
    >
      <select
        class="select select-bordered"
        :value="ranking.color"
        @change="(e) => updateRankingField('color', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="theme in themes" :key="theme" :value="theme">
          {{ theme }}
        </option>
      </select>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { SettingsRankingSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import GameRankingList from '@/MainGenerator/components/GameRankingViewer/GameRankingList.vue'
  import { useEnabledGames } from '@/common/GameScripts/useEnabledGames'

  const omikujiStore = useOmikujiStore()
  const { enabledGameScriptMap } = useEnabledGames()
  const { data } = storeToRefs(omikujiStore)

  const ranking = computed(() => data.value.displaySettings.components.ranking)

  // 更新関数
  const updateRankingField = (field: keyof typeof ranking.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      ranking: {
        ...ranking.value,
        [field]: value,
      },
    })
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
    sortByHighScore: () => resetField('sortByHighScore'),
    color: () => resetField('color'),
  }
</script>
