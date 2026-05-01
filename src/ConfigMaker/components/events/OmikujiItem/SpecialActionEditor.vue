<!-- src/ConfigMaker/components/events/OmikujiItem/SpecialActionEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- type -->
    <SettingItem label="特殊動作の種類" description="実行する特殊動作を選択してください">
      <select
        :value="behavior.type"
        @change="updateBehavior('type', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm w-full"
      >
        <option v-for="(info, key) in actionSpecialMap" :key="key" :value="key">
          {{ info.label }}
        </option>
      </select>
    </SettingItem>

    <template v-if="!isLogResetType">
      <!-- isCountEvent -->
      <SettingItem label="イベントとしてカウント" description="ONでおみくじ回数としてカウントされます">
        <label class="label cursor-pointer gap-3">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="behavior.isCountEvent"
            @change="updateBehavior('isCountEvent', ($event.target as HTMLInputElement).checked)"
          />
          <span class="label-text">カウント{{ behavior.isCountEvent ? 'する' : 'しない' }}</span>
        </label>
      </SettingItem>

      <!-- 加算・減産する数値 -->
      <SettingItem
        v-if="behavior.isCountEvent"
        label="加算・減算する数値"
        description="カウンターで増減させる数値を指定します"
      >
        <input
          type="number"
          step="1"
          class="input input-bordered input-sm w-full"
          :value="behavior.countEvent"
          @input="onCountEventInput"
        />
      </SettingItem>
    </template>

    <!-- log系処理 -->
    <template v-if="isLogType">
      <InformationCard variant="warning">
        <p>これらの項目は、現時点では実験的な機能です。動作や仕様は予告なく変更される可能性があります。</p>
      </InformationCard>

      <!-- targetKey -->
      <SettingItem label="対象キー" description="ログ出力対象の eventKey / scriptKey">
        <input
          type="text"
          class="input input-bordered input-sm w-full"
          :value="behavior.log.targetKey"
          @input="updateLog('targetKey', ($event.target as HTMLInputElement).value)"
        />
      </SettingItem>

      <!-- logFormat -->
      <SettingItem
        label="ログフォーマット"
        description="1行の表示形式"
        :showReset="true"
        @reset="updateLog('logFormat', LOG_FORMAT_DEFAULT)"
      >
        <input
          type="text"
          class="input input-bordered input-sm w-full"
          :value="behavior.log.logFormat"
          @input="updateLog('logFormat', ($event.target as HTMLInputElement).value)"
        />
        <span class="text-sm text-base-content/60">仕様は未確定です</span>
      </SettingItem>

      <!-- logLimit -->
      <SettingItem label="最大出力件数" description="わんコメに投稿するログの最大件数（1〜100）">
        <input
          type="number"
          min="1"
          max="100"
          class="input input-bordered input-sm w-full"
          :value="behavior.log.logLimit"
          @input="updateLog('logLimit', Number(($event.target as HTMLInputElement).value))"
        />
      </SettingItem>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    EventCategoryType,
    ActionBehaviorType,
    ActionBehaviorLogType,
    actionSpecialMap,
    LOG_FORMAT_DEFAULT,
  } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const props = defineProps<{
    index: number
    category: EventCategoryType
    selectedItemKey: string | null
  }>()

  const { updateOmikujiByIndex } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  const omikujiSets = computed(() => {
    if (!props.selectedItemKey) return []
    return getItem(props.category, props.selectedItemKey)?.omikuji ?? []
  })

  const omikujiItem = computed(() => omikujiSets.value[props.index] ?? null)
  const behavior = computed<ActionBehaviorType>(() => omikujiItem.value?.behavior)

  /** type が log系かどうか */
  const isLogResetType = computed(() => behavior.value.type.includes('log') || behavior.value.type.includes('reset'))
  const isLogType = computed(() => behavior.value.type.includes('log'))

  /** behavior 直下のフィールドを更新 */
  const updateBehavior = (key: keyof ActionBehaviorType, value: unknown) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      behavior: { ...item.behavior, [key]: value },
    }))
  }

  /** behavior.log 配下のフィールドを更新 */
  const updateLog = (key: keyof ActionBehaviorLogType, value: unknown) => {
    if (props.index === -1 || !props.selectedItemKey) return
    updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      behavior: {
        ...item.behavior,
        log: { ...item.behavior.log, [key]: value },
      },
    }))
  }

  const onCountEventInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value

    // 空欄 → 0
    if (value === '') {
      updateBehavior('countEvent', 0)
      return
    }

    // 整数に変換
    const parsed = parseInt(value, 10)
    updateBehavior('countEvent', parsed)
  }
</script>
