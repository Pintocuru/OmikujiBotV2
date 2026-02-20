<!-- src/ConfigMaker/components/rules/OmikujiItem/OmikujiItemHeader.vue -->
<template>
  <div class="flex items-center gap-4">
    <!-- 名前 -->
    <div class="form-control flex-1">
      <SettingItem label="おみくじ名" description="識別しやすい名前を入力">
        <input
          type="text"
          :value="omikujiItem?.name"
          @input="updateName(($event.target as HTMLInputElement).value)"
          placeholder="おみくじ名"
          class="input input-bordered input-sm w-full"
        />
      </SettingItem>
    </div>

    <!-- メニュー -->
    <div class="ml-auto">
      <MenuDropdown @duplicate="duplicateOmikuji" @delete="removeOmikuji" />
    </div>
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
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { v4 } from 'uuid'

  const props = defineProps<{
    category: RulesCategoryType
    selectedItemKey: string | null
    omikujiItem: OmikujiItemType | null
    index: number
    isCard?: boolean
  }>()

  const { updateOmikujiByIndex, updateRecordProperty } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // 名前更新
  const updateName = (value: string) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      name: value,
    }))
  }

  const duplicateOmikuji = () => {
    if (props.index === -1 || !props.selectedItemKey) return
    const id = v4()
    const duplicated = {
      ...JSON.parse(JSON.stringify(props.omikujiItem)),
      id,
      key: id,
      name: `${props.omikujiItem?.name}(コピー)`,
    }

    // 配列全体を更新
    const record = getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(props.index + 1, 0, duplicated)
    updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }

  const removeOmikuji = () => {
    if (props.index === -1 || !props.selectedItemKey) return

    const record = getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(props.index, 1)
    updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }
</script>
