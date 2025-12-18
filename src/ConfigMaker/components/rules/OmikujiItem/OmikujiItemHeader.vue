<!-- src\ConfigMaker\components\rules\OmikujiItemHeader.vue -->
<template>
  <div class="flex items-center gap-4">
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
  import { computed } from 'vue'
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
    isCard?: boolean
  }>()

  const omikujiStore = useOmikujiStore()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // 名前更新
  const updateName = (value: string) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      name: value,
    }))
  }

  const duplicateOmikuji = () => {
    if (index.value === -1 || !props.selectedItemKey) return
    const id = crypto.randomUUID()
    const duplicated = {
      ...JSON.parse(JSON.stringify(props.omikuji)),
      id,
      key: id,
      name: `${props.omikuji.name}(コピー)`,
    }

    // 配列全体を更新
    const record = omikujiStore.getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(index.value + 1, 0, duplicated)
    omikujiStore.updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }

  const removeOmikuji = () => {
    if (index.value === -1 || !props.selectedItemKey) return

    const record = omikujiStore.getItem(props.category, props.selectedItemKey)
    if (!record?.omikuji) return

    const newOmikuji = [...record.omikuji]
    newOmikuji.splice(index.value, 1)
    omikujiStore.updateRecordProperty(props.category, props.selectedItemKey, 'omikuji', newOmikuji)
  }
</script>
