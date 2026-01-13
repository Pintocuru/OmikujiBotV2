<!-- src\ConfigMaker\components\componentEditor\ranking\RankingComponentEditor.vue -->
<template>
  <!-- ランキングプレビュー -->
  <GameRankingManager v-if="ranking.targetScriptKeys.length > 0" :botMessages="[]" :settings="ranking" />
  <NoParamsCard v-else :message="'対象スクリプトIDを設定してください'" />

  <!-- テーマカラー -->
  <SettingItem label="カラー" description="ランキングのテーマカラーを選択します" :forceMode="'pro'">
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

  <!-- コンポーネント選択 -->
  <!-- !現在は使わないのでisDev -->
  <SettingItem v-if="isDev && isGod" label="表示スタイル" description="ランキングの表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="style in rankingComponents"
        :key="style.value"
        class="badge cursor-pointer"
        :class="ranking.component === style.value ? 'badge-primary' : 'badge-outline'"
        @click="updateRankingField('component', style.value)"
      >
        {{ style.label }}
      </div>
    </div>
  </SettingItem>

  <!-- 対象スクリプトID -->
  <SettingItem label="対象スクリプトID(複数)" description="ランキング対象のGameScriptを指定します">
    <div class="flex flex-wrap gap-2">
      <!-- 基本リスト -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="ranking.targetScriptKeys.includes('basicList') ? 'badge-primary' : 'badge-outline'"
        @click="toggleScriptKey('basicList')"
      >
        BOTアクション
      </div>

      <!-- ゲームスクリプト -->
      <div
        v-for="script in enabledGameScriptMap"
        :key="script.key"
        class="badge badge-lg cursor-pointer"
        :class="ranking.targetScriptKeys.includes(script.key) ? 'badge-primary' : 'badge-outline'"
        @click="toggleScriptKey(script.key)"
      >
        {{ script.name }}
      </div>
    </div>
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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 順位のソート -->
    <SettingItem label="順位のソート" description="得点の高い順・低い順・新しい順から選べます">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="order in rankingSortOrders"
          :key="order"
          class="badge badge-lg cursor-pointer"
          :class="ranking.sortOrder === order ? 'badge-primary' : 'badge-outline'"
          @click="ranking.sortOrder = order"
        >
          {{ rankingSortOrderLabels[order] }}
        </div>
      </div>
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
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import GameRankingManager from '@/common/ui/GameRanking/GameRankingManager.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { isDev, rankingComponents, rankingSortOrderLabels, rankingSortOrders, SettingsRankingSchema } from '@/types/'
  import { getAvailableScripts } from '@game/GameScriptsRules'
  import { gameScriptMap } from '@game/GameScriptsMap'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro, isGod } = useSettingMode()

  const ranking = computed(() => data.value.components.ranking)

  // 利用可能なゲームスクリプトを取得
  const enabledGameScriptMap = computed(() => {
    const { gameScripts } = data.value.featureUsage

    // 現在の状態からモードを判定
    const mode = isGod.value ? 'godMode' : isPro.value ? 'pro' : 'basic'

    // 分離した共通ロジックを使用
    const enabled = getAvailableScripts(mode, gameScripts)

    return Object.entries(gameScriptMap)
      .filter(([scriptId]) => enabled.includes(scriptId))
      .map(([, scriptPreset]) => scriptPreset)
  })

  // 更新関数
  const updateRankingField = (field: keyof typeof ranking.value, value: any) => {
    omikujiStore.updateNestedComponents('ranking', {
      ...ranking.value,
      [field]: value,
    })
  }

  // スクリプトIDの更新
  const toggleScriptKey = (key: string) => {
    const current = ranking.value.targetScriptKeys ?? []
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    updateRankingField('targetScriptKeys', next)
  }

  // リセット関数
  const resetField = (field: keyof typeof ranking.value) => {
    const defaults = SettingsRankingSchema.parse({})
    updateRankingField(field, defaults[field])
  }

  const resetMap = {
    targetScriptKeys: () => resetField('targetScriptKeys'),
    title: () => resetField('title'),
    limit: () => resetField('limit'),
    sortOrder: () => resetField('sortOrder'),
    color: () => resetField('color'),
  }
</script>
