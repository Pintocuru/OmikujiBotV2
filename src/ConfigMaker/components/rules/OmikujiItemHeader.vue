<!-- src\ConfigMaker\components\rules\OmikujiItemHeader.vue -->
<template>
  <div class="flex items-center gap-4">
    <!-- ドラッグハンドル -->
    <div class="drag-handle cursor-move text-base-content/50 hover:text-base-content">
      <GripVertical class="w-5 h-5" />
    </div>

    <!-- 名前 -->
    <div class="form-control flex-1">
      <SettingItem label="おみくじ名" description="識別しやすい名前を入力">
        <input
          type="text"
          :value="omikuji.name"
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
</template>

<script setup lang="ts">
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { GripVertical } from 'lucide-vue-next'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  // 共通の更新関数
  const updateOmikujiSets = (updateFn: (sets: OmikujiItemType[], index: number) => OmikujiItemType[]) => {
    if (!props.selectedItemKey) return
    const index = props.allOmikuji.findIndex((item) => item.key === props.omikuji.key)
    if (index === -1) return
    omikujiStore.updateRecordProperty(
      props.category,
      props.selectedItemKey,
      'omikuji',
      updateFn([...props.allOmikuji], index)
    )
  }

  const updateName = (value: string) =>
    updateOmikujiSets((sets, index) => {
      sets[index] = { ...sets[index], name: value }
      return sets
    })

  const duplicateOmikuji = () =>
    updateOmikujiSets((sets, index) => {
      const id = crypto.randomUUID()
      const duplicated = {
        ...JSON.parse(JSON.stringify(props.omikuji)),
        id,
        key: id,
        name: `${props.omikuji.name}(コピー)`,
      }
      sets.splice(index + 1, 0, duplicated)
      return sets
    })

  const removeOmikuji = () => {
    updateOmikujiSets((sets, index) => {
      sets.splice(index, 1)
      return sets
    })
  }
</script>
