<!-- src\ConfigMaker\components\componentEditor\ComponentConditionsEditor.vue -->
<template>
  <!-- コンポーネント表示設定 -->
  <SettingItem label="表示するコンポーネント" description="ジェネレーターで表示するUIを選択">
    <div class="flex flex-wrap gap-2">
      <label
        v-for="comp in enabledComponents"
        :key="comp.id"
        class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          :checked="conditions.includes(comp.id)"
          @change="toggleCondition(comp.id)"
        />
        <span class="text-sm">{{ comp.label }}</span>
      </label>
    </div>
  </SettingItem>

  <!-- コンポーネント表示設定 -->
  <InformationCard v-if="!conditions.length">
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
  import { useEnabledComponents } from '@config/components/componentEditor/useEnabledComponents'
  import { SettingsComponentsCondition } from '@/types/'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { enabledComponents } = useEnabledComponents()

  // 個別のcomputed値
  const conditions = computed(() => data.value.components.conditions)

  // 汎用的な更新関数
  const toggleCondition = (condition: SettingsComponentsCondition) => {
    const newConditions = conditions.value.includes(condition)
      ? conditions.value.filter((c) => c !== condition)
      : [...conditions.value, condition]

    omikujiStore.updateComponentsConditions(newConditions)
  }
</script>
