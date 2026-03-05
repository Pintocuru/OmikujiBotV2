<!-- src/ConfigMaker/components/rules/OmikujiItem/SpecialActionEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- type -->
    <SettingItem label="特殊動作の種類" description="実行する特殊動作を選択してください">
      <select
        :value="behavior.type"
        @change="updateValue('type', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm w-full"
      >
        <option v-for="(info, key) in actionSpecialMap" :key="key" :value="key">
          {{ info.label }}
        </option>
      </select>
    </SettingItem>

    <!-- countEvent -->
    <SettingItem label="イベントとしてカウント" description="ONでおみくじ回数としてカウントされます">
      <label class="label cursor-pointer gap-3">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="behavior.countEvent"
          @change="updateValue('countEvent', ($event.target as HTMLInputElement).checked)"
        />
        <span class="label-text">カウント{{ behavior.countEvent ? 'する' : 'しない' }}</span>
      </label>
    </SettingItem>

    <!-- targetKey -->
    <!-- 条件設定の説明 -->
    <InformationCard>
      <p>
        発動条件が複数の場合は、
        <code class="label bg-accent text-accent-content">すべての条件を満たしたとき</code
        >にルールが発動します。(ANDのみ)
      </p>
    </InformationCard>

    <SettingItem label="対象キー" description="ログ出力対象の eventKey / scriptKey">
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        :value="behavior.targetKey ?? ''"
        @input="updateValue('targetKey', ($event.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- log系処理 -->
    <template v-if="behavior.type.includes('log')">
      <!-- logFormat -->
      <SettingItem
        label="ログフォーマット"
        description="わんコメに投稿するログの最大件数"
        :showReset="true"
        @reset="behavior.logFormat = '<<user>> <<score>> <<createdAt>>'"
      >
        <input
          type="text"
          class="input input-bordered input-sm w-full"
          :value="behavior.logFormat ?? ''"
          @input="updateValue('logFormat', ($event.target as HTMLInputElement).value)"
        />
      </SettingItem>

      <!-- logLimit -->
      <SettingItem label="最大出力件数" description="わんコメに投稿するログの最大件数">
        <input
          type="number"
          min="0"
          max="100"
          class="input input-bordered input-sm w-full"
          :value="behavior.logLimit ?? ''"
          @input="updateValue('logLimit', Number(($event.target as HTMLInputElement).value))"
        />
      </SettingItem>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, ActionBehaviorType, actionSpecialMap } from '@/types/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const props = defineProps<{
    index: number
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  const omikujiSets = computed(() => {
    if (!props.selectedItemKey) return []
    const record = getItem(props.category, props.selectedItemKey)
    return record?.omikuji || []
  })

  const omikujiItem = computed(() => omikujiSets.value[props.index] || null)
  const behavior = computed<ActionBehaviorType>(() => omikujiItem.value?.behavior)

  const updateValue = (key: keyof ActionBehaviorType, value: any) => {
    if (props.index === -1 || !props.selectedItemKey) return

    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      behavior: {
        ...item.behavior,
        [key]: value,
      },
    }))
  }
</script>
