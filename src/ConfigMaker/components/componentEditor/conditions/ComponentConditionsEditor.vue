<!-- src/ConfigMaker/components/componentEditor/conditions/ComponentConditionsEditor.vue -->
<template>
  <!-- スロット別コンポーネント設定 -->
  <SettingItem
    v-for="{ slot, label } in slotConfigs"
    :key="slot"
    :label="label"
    :description="UiSlotMap[slot].description"
  >
    <div class="flex flex-wrap items-center gap-2">
      <!-- 未使用バッジ -->
      <span
        class="badge badge-outline cursor-pointer select-none"
        :class="{ 'badge-ghost opacity-40': getSlotKind(slot) !== '' }"
        @click="updateSlotKind(slot, '')"
      >
        未使用
      </span>

      <!-- コンポーネント選択バッジ -->
      <span
        v-for="comp in getAvailableComponents(slot)"
        :key="comp.kind"
        class="badge cursor-pointer select-none"
        :class="[
          slotConfigs.find((s) => s.slot === slot)?.badgeClass,
          getSlotKind(slot) === comp.kind ? 'opacity-100' : 'badge-outline opacity-40',
          comp.disabled ? 'cursor-not-allowed' : '',
        ]"
        :title="comp.disabledReason || comp.label"
        @click="!comp.disabled && updateSlotKind(slot, comp.kind)"
      >
        {{ comp.label }}
      </span>
    </div>
  </SettingItem>

  <!-- BOTコメントの投稿方法 -->
  <SettingItem label="サブコンポーネントを使用する" description="secondary（サブ）側の表示を有効にします">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" class="toggle toggle-primary" :checked="enableSecondary" @change="handleEnableSecondary" />
      <span>{{ enableSecondary ? '使用する' : '使用しない' }}</span>
    </label>
  </SettingItem>

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
  import { UiSlotType, UiKind, getKindsForSlot, uiKindMap, UiSlotMap } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()

  const conditions = computed(() => data.value.components.conditions)

  // スロットごとの表示設定
  const slotConfigs: { slot: UiSlotType; label: string; badgeClass: string; selectClass: string }[] = [
    { slot: 'primary', label: UiSlotMap.primary.label, badgeClass: 'badge-primary', selectClass: 'select-primary' },
    {
      slot: 'secondary',
      label: UiSlotMap.secondary.label,
      badgeClass: 'badge-secondary',
      selectClass: 'select-secondary',
    },
    { slot: 'extra', label: UiSlotMap.extra.label, badgeClass: 'badge-accent', selectClass: 'select-accent' },
  ]

  // 指定スロットに設定されているkindを取得
  const getSlotKind = (slot: UiSlotType): UiKind | '' => conditions.value.find((c) => c.slot === slot)?.kind ?? ''

  // 指定kindが他のスロットで使用されているかチェック
  const isKindUsedInOtherSlot = (kind: UiKind, currentSlot: UiSlotType): boolean =>
    conditions.value.some((c) => c.kind === kind && c.slot !== currentSlot)

  // スロットで利用可能なコンポーネント一覧を取得
  const getAvailableComponents = (slot: UiSlotType) => {
    const { components } = data.value.featureUsage
    return getKindsForSlot(slot)
      .filter((kind) => components.includes(kind))
      .map((kind) => {
        // TODO この行だけ特別になってしまってるので、何らかの方法で共通化させたい
        const isCounterDisabled = kind === 'counter' && !isComment.value
        const isUsedInOther = isKindUsedInOtherSlot(kind, slot)
        return {
          kind,
          label: uiKindMap[kind].label,
          disabled: isCounterDisabled || isUsedInOther,
          disabledReason: isCounterDisabled ? '（利用不可）' : isUsedInOther ? '（他のスロットで使用中）' : '',
        }
      })
  }

  // スロットの更新
  const updateSlotKind = (slot: UiSlotType, newKind: UiKind | '') => {
    const newConditions = conditions.value
      .filter((c) => c.slot !== slot && c.kind !== newKind)
      .concat(newKind ? [{ slot, kind: newKind }] : [])

    omikujiStore.updateComponentsConditions(newConditions)
  }

  const handleEnableSecondary = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked
    omikujiStore.updateComponents({ enableSecondary: checked })
  }

  const enableSecondary = computed(() => data.value.components.enableSecondary)
</script>
