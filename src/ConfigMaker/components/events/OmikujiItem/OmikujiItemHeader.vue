<!-- src/ConfigMaker/components/events/OmikujiItem/OmikujiItemHeader.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <!-- 名前 -->
    <SettingItem label="おみくじ名" description="識別しやすい名前を入力">
      <input
        type="text"
        :value="omikujiItem?.name"
        @input="updateName(($event.target as HTMLInputElement).value)"
        placeholder="おみくじ名"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>

    <SettingItem label="クールダウン" description="これ以降の実行を一定時間ブロックします（秒）">
      <input
        type="number"
        :value="omikujiItem?.actionCooldownSeconds ?? 0"
        @input="updateCooldown(($event.target as HTMLInputElement).value)"
        min="0"
        step="0.1"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>
  </div>

  <!-- OmikujiItemBasic コンポーネント -->
  <OmikujiItemPriority
    v-if="category === 'comments'"
    :selectedItemKey="selectedItemKey"
    :omikujiItem="omikujiItem"
    :index="index"
  />
</template>

<script setup lang="ts">
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiItemPriority from './OmikujiItemPriority.vue'
  import { EventCategoryType } from '@/types/OmikujiData/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const props = defineProps<{
    category: EventCategoryType
    selectedItemKey: string | null
    omikujiItem: OmikujiItemType | null
    index: number
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()

  // 名前更新
  const updateName = (value: string) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      name: value,
    }))
  }

  const updateCooldown = (value: string) => {
    if (props.index === -1 || !props.selectedItemKey) return

    const num = parseFloat(value)
    const safe = isNaN(num) || num < 0 ? 0 : num

    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      actionCooldownSeconds: safe,
    }))
  }
</script>
