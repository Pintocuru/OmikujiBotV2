<!-- src\ConfigMaker\components\componentEditor\ComponentConditionsEditor.vue -->
<template>
  <!-- アイテム表示設定 -->
  <SettingItem label="表示するアイテム" description="ジェネレーターで表示するUIを選択">
    <div class="flex flex-wrap gap-2">
      <label
        v-for="comp in enabledComponents"
        :key="comp.id"
        class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': comp.disabled }"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          :checked="conditions.includes(comp.id)"
          :disabled="comp.disabled"
          @change="toggleCondition(comp.id)"
        />
        <span class="text-sm">{{ comp.label }}</span>
      </label>
    </div>
  </SettingItem>

  <!-- コメント機能OFFの警告 -->
  <InformationCard v-if="!isComment && hasCounterInList" variant="warning">
    <p class="text-base">
      <span class="label bg-warning text-warning-content">コメント機能がOFF</span
      >のため、カウンターアイテムは使用できません。<br />
      カウンターアイテムを使用する場合は、機能設定でコメント機能を有効にしてください。
    </p>
  </InformationCard>

  <!-- 条件未設定の警告 -->
  <InformationCard v-else-if="!conditions.length" variant="neutral" icon="warning">
    <p class="text-base">
      あれっ、<span class="label bg-accent text-accent-content">条件がまだ設定されてない</span>みたいです。<br />
      そのままだとプレビューに何も出力されませんよ。<br />
      コメントは読んでくれますが、画面表示は空っぽです。<br />
      意図的なら問題ありませんが、設定忘れなら要チェックです。<br />
      少し見直して<span class="label bg-accent text-accent-content">条件を追加</span>してみませんか？
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { componentLabels, SettingsComponentsCondition } from '@/types/'
  import { getAvailableComponents } from '../componentRules'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  // 個別のcomputed値
  const conditions = computed(() => data.value.components.conditions)

  // 有効なコンポーネント一覧
  const enabledComponents = computed(() => {
    const { components } = data.value.featureUsage

    return components
      .filter((id): id is keyof typeof componentLabels => id in componentLabels)
      .map((id) => ({
        id,
        label: componentLabels[id],
        disabled: id === 'counter' && !isComment.value, // counterはコメント機能必須
      }))
  })

  // counterが利用可能リストに含まれているか
  const hasCounterInList = computed(() => enabledComponents.value.some((comp) => comp.id === 'counter'))

  // 汎用的な更新関数
  const toggleCondition = (condition: SettingsComponentsCondition) => {
    const newConditions = conditions.value.includes(condition)
      ? conditions.value.filter((c) => c !== condition)
      : [...conditions.value, condition]

    omikujiStore.updateComponentsConditions(newConditions)
  }
</script>
