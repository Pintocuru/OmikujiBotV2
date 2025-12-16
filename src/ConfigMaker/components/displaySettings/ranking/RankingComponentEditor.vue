<!-- src\ConfigMaker\components\displaySettings\components\RankingComponentEditor.vue -->
<template>
  <div class="card bg-base-100 p-4 flex flex-col gap-4">
    <!-- プレビュー -->
    <div class="border p-2 rounded">
      <h3 class="text-lg font-bold mb-2">{{ ranking.title }}</h3>
      <ul>
        <li v-for="i in ranking.limit" :key="i" class="flex gap-2 items-center">
          <span v-if="ranking.showRankNumber">{{ i }}位</span>
          <span>ユーザー{{ i }}</span>
          <span v-if="ranking.showScore">: {{ Math.floor(Math.random() * 1000) }}点</span>
        </li>
      </ul>
    </div>

    <!-- 対象のGameScriptID -->
    <!-- TODO:GameGameScript を持ってくる -->
    <SettingItem
      label="対象スクリプトID"
      description="ランキング対象のGameScriptを指定します"
      :showReset="true"
      @reset="resetMap.scriptId"
    >
      <input
        type="text"
        class="input input-bordered w-full"
        :value="ranking.scriptKey || ''"
        @input="(e) => updateRankingField('scriptId', (e.target as HTMLInputElement).value || null)"
      />
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

    <!-- スコア表示 -->
    <SettingItem
      label="スコア表示"
      description="ランキングにスコアを表示するかどうか"
      :showReset="true"
      @reset="resetMap.showScore"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="ranking.showScore"
        @change="(e) => updateRankingField('showScore', (e.target as HTMLInputElement).checked)"
      />
    </SettingItem>

    <!-- 順位の表示 -->
    <SettingItem
      label="順位番号表示"
      description="ランキングに順位番号を表示するかどうか"
      :showReset="true"
      @reset="resetMap.showRankNumber"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="ranking.showRankNumber"
        @change="(e) => updateRankingField('showRankNumber', (e.target as HTMLInputElement).checked)"
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

  const omikujiStore = useOmikujiStore()
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
    scriptId: () => resetField('scriptId'),
    title: () => resetField('title'),
    limit: () => resetField('limit'),
    showScore: () => resetField('showScore'),
    showRankNumber: () => resetField('showRankNumber'),
    color: () => resetField('color'),
  }
</script>
