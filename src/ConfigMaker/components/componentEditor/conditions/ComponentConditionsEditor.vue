<!-- src\ConfigMaker\components\componentEditor\conditions\ComponentConditionsEditor.vue -->
<template>
  <!-- スロット別コンポーネント設定 -->
  <SettingItem label="表示するアイテム" description="各スロットに表示するコンポーネントを選択">
    <div class="space-y-4">
      <!-- Primary Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-primary" :class="{ 'opacity-40': !getSlotKind('primary') }"> メイン表示 </span>
        <select
          :value="getSlotKind('primary')"
          @change="updateSlot('primary', $event)"
          class="select select-bordered select-primary"
        >
          <option value="">(未使用)</option>
          <option
            v-for="comp in getAvailableComponents('primary')"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled"
          >
            {{ comp.label }}{{ comp.disabledReason }}
          </option>
        </select>
      </div>

      <!-- Secondary Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-secondary" :class="{ 'opacity-40': !getSlotKind('secondary') }"> サブ表示 </span>
        <select
          :value="getSlotKind('secondary')"
          @change="updateSlot('secondary', $event)"
          class="select select-bordered select-secondary"
        >
          <option value="">(未使用)</option>
          <option
            v-for="comp in getAvailableComponents('secondary')"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled"
          >
            {{ comp.label }}{{ comp.disabledReason }}
          </option>
        </select>
      </div>

      <!-- Extra Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-accent" :class="{ 'opacity-40': !getSlotKind('extra') }"> エクストラ </span>
        <select
          :value="getSlotKind('extra')"
          @change="updateSlot('extra', $event)"
          class="select select-bordered select-accent"
        >
          <option value="">(未使用)</option>
          <option
            v-for="comp in getAvailableComponents('extra')"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled"
          >
            {{ comp.label }}{{ comp.disabledReason }}
          </option>
        </select>
      </div>
    </div>
  </SettingItem>

  <!-- コメント機能OFFの警告 -->
  <InformationCard v-if="!isComment && hasCounterSelected" variant="warning">
    <p class="text-base">
      <span class="label bg-warning text-warning-content">コメント機能がOFF</span
      >のため、カウンターアイテムは使用できません。<br />
      カウンターアイテムを使用する場合は、機能設定でコメント機能を有効にしてください。
    </p>
  </InformationCard>

  <!-- 条件未設定の警告 -->
  <InformationCard v-if="conditions.length === 0" variant="neutral" icon="warning">
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
  import { ComponentSlot, ComponentKind, getKindsForSlot, COMPONENT_DEFINITIONS } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()

  const conditions = computed(() => data.value.components.conditions)
  const hasCounterSelected = computed(() => conditions.value.some((c) => c.kind === 'counter'))

  // 指定スロットに設定されているkindを取得
  const getSlotKind = (slot: ComponentSlot): ComponentKind | '' =>
    conditions.value.find((c) => c.slot === slot)?.kind ?? ''

  // 指定kindが他のスロットで使用されているかチェック
  const isKindUsedInOtherSlot = (kind: ComponentKind, currentSlot: ComponentSlot): boolean =>
    conditions.value.some((c) => c.kind === kind && c.slot !== currentSlot)

  // スロットで利用可能なコンポーネント一覧を取得
  const getAvailableComponents = (slot: ComponentSlot) => {
    const { components } = data.value.featureUsage
    return getKindsForSlot(slot)
      .filter((kind) => components.includes(kind))
      .map((kind) => {
        const isCounterDisabled = kind === 'counter' && !isComment.value
        const isUsedInOther = isKindUsedInOtherSlot(kind, slot)
        return {
          kind,
          label: COMPONENT_DEFINITIONS[kind].label,
          disabled: isCounterDisabled || isUsedInOther,
          disabledReason: isCounterDisabled ? '（利用不可）' : isUsedInOther ? '（他のスロットで使用中）' : '',
        }
      })
  }

  // スロットの更新
  const updateSlot = (slot: ComponentSlot, event: Event) => {
    const newKind = (event.target as HTMLSelectElement).value as ComponentKind | ''
    const newConditions = conditions.value
      .filter((c) => c.slot !== slot && c.kind !== newKind) // 該当スロットと重複kindを除外
      .concat(newKind ? [{ slot, kind: newKind }] : []) // 新しい設定を追加

    omikujiStore.updateComponentsConditions(newConditions)
  }
</script>
