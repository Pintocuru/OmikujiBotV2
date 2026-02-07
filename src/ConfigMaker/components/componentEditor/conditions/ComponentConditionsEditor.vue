<!-- src\ConfigMaker\components\componentEditor\conditions\ComponentConditionsEditor.vue -->
<template>
  <!-- スロット別コンポーネント設定 -->
  <SettingItem label="表示するアイテム" description="各スロットに表示するコンポーネントを選択">
    <div class="space-y-4">
      <!-- Primary Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-primary">メイン表示</span>
        <select
          :value="getSlotKind('primary')"
          @change="updateSlot('primary', $event)"
          class="select select-bordered select-primary"
        >
          <option value="">未使用</option>
          <option
            v-for="comp in availableComponents"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled || isKindUsedInOtherSlot(comp.kind, 'primary')"
          >
            {{ comp.label }}
            {{ comp.disabled ? '（利用不可）' : '' }}
            {{ isKindUsedInOtherSlot(comp.kind, 'primary') ? '（他のスロットで使用中）' : '' }}
          </option>
        </select>
      </div>

      <!-- Secondary Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-secondary">サブ表示</span>
        <select
          :value="getSlotKind('secondary')"
          @change="updateSlot('secondary', $event)"
          class="select select-bordered select-secondary"
        >
          <option value="">未使用</option>
          <option
            v-for="comp in availableComponents"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled || isKindUsedInOtherSlot(comp.kind, 'secondary')"
          >
            {{ comp.label }}
            {{ comp.disabled ? '（利用不可）' : '' }}
            {{ isKindUsedInOtherSlot(comp.kind, 'secondary') ? '（他のスロットで使用中）' : '' }}
          </option>
        </select>
      </div>

      <!-- Extra Slot -->
      <div class="flex items-center gap-2">
        <span class="badge badge-accent">エクストラ</span>
        <select
          :value="getSlotKind('extra')"
          @change="updateSlot('extra', $event)"
          class="select select-bordered select-accent"
        >
          <option value="">未使用</option>
          <option
            v-for="comp in availableComponents"
            :key="comp.kind"
            :value="comp.kind"
            :disabled="comp.disabled || isKindUsedInOtherSlot(comp.kind, 'extra')"
          >
            {{ comp.label }}
            {{ comp.disabled ? '（利用不可）' : '' }}
            {{ isKindUsedInOtherSlot(comp.kind, 'extra') ? '（他のスロットで使用中）' : '' }}
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
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { ComponentSlot, ComponentKind, componentLabels } from '@/types/'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()

  const conditions = computed(() => data.value.components.conditions)

  // 利用可能なコンポーネント一覧
  const availableComponents = computed(() => {
    const { components } = data.value.featureUsage

    return components
      .filter((id): id is ComponentKind => id in componentLabels)
      .map((kind) => ({
        kind,
        label: componentLabels[kind],
        disabled: kind === 'counter' && !isComment.value, // counterはコメント機能必須
      }))
  })

  // 指定スロットに設定されているkindを取得
  const getSlotKind = (slot: ComponentSlot): ComponentKind | '' => {
    const condition = conditions.value.find((c) => c.slot === slot)
    return condition?.kind ?? ''
  }

  // kindのラベルを取得
  const getKindLabel = (kind: ComponentKind): string => {
    return componentLabels[kind] ?? kind
  }

  // 指定kindが他のスロットで使用されているかチェック
  const isKindUsedInOtherSlot = (kind: ComponentKind, currentSlot: ComponentSlot): boolean => {
    return conditions.value.some((c) => c.kind === kind && c.slot !== currentSlot)
  }

  // counterが選択されているか
  const hasCounterSelected = computed(() => conditions.value.some((c) => c.kind === 'counter'))

  // スロットの更新
  const updateSlot = (slot: ComponentSlot, event: Event) => {
    const target = event.target as HTMLSelectElement
    const newKind = target.value as ComponentKind | ''

    // 新しいconditions配列を作成
    let newConditions = conditions.value.filter((c) => c.slot !== slot)

    // 空文字でなければ追加
    if (newKind !== '') {
      // 同じkindが他のスロットで使われていれば削除
      newConditions = newConditions.filter((c) => c.kind !== newKind)
      // 新しい設定を追加
      newConditions.push({ slot, kind: newKind })
    }

    omikujiStore.updateComponentsConditions(newConditions)
  }
</script>
