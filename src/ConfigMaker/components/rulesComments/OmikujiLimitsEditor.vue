<!-- src/configMaker/components/comments/OmikujiLimitsEditor.vue -->
<template>
  <div class="form-control bg-base-100 p-3 rounded-lg space-y-4">
    <h3 class="font-semibold border-b pb-1">重複処理 - 前回の発動からその時間内に発動するおみくじを無効にします</h3>
    <SettingItem
      label="クールダウン時間(秒)"
      description="おみくじを引けるようになるまでの秒数 (0で無効)"
      :showReset="true"
      @reset="cooldownSeconds = 3"
    >
      <input type="number" v-model.number="cooldownSeconds" min="0" max="300" class="input input-bordered w-full" />
    </SettingItem>

    <SettingItem
      v-if="cooldownSeconds > 0"
      label="クールダウンメッセージ"
      description="未設定の場合はデフォルトメッセージになります"
      :showReset="true"
      @reset="cooldownMessage = null"
    >
      <!-- null のとき：チェックボックス -->
      <label v-if="cooldownMessage === null" class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="checkbox" @change="cooldownMessage = ''" />
        <span>カスタムメッセージを設定する</span>
      </label>

      <!-- null でないとき：従来表示 -->
      <input
        v-else
        type="text"
        v-model="cooldownMessage"
        class="input input-bordered w-full"
        placeholder="空欄の場合は何も表示しません。右のリセットボタンでデフォルトになります"
      />
    </SettingItem>
  </div>

  <div class="form-control bg-base-100 p-3 rounded-lg space-y-4">
    <h3 class="font-semibold border-b pb-1">連投制限 - 同じユーザーが続けておみくじを引ける回数を制限します</h3>
    <SettingItem
      label="連投許可回数"
      description="同じユーザーが続けて引ける最大回数 (0で無制限)"
      :showReset="true"
      @reset="isRepeatAllowed = 1"
    >
      <input type="number" v-model.number="isRepeatAllowed" min="0" class="input input-bordered w-full" />
    </SettingItem>

    <SettingItem
      v-if="isRepeatAllowed > 0"
      label="連投制限メッセージ"
      description="未設定の場合はデフォルトメッセージになります"
      :showReset="true"
      @reset="repeatMessage = null"
    >
      <!-- null のとき：チェックボックス -->
      <label v-if="repeatMessage === null" class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="checkbox" @change="repeatMessage = ''" />
        <span>カスタムメッセージを設定する</span>
      </label>

      <!-- null でないとき：従来表示 -->
      <input
        v-else
        type="text"
        v-model="repeatMessage"
        class="input input-bordered w-full"
        placeholder="空欄の場合は何も表示しません。右のリセットボタンでデフォルトになります"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiLimitsType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    modelValue: OmikujiLimitsType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof OmikujiLimitsType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updatedLimits = { ...props.modelValue, [key]: value }
        omikujiStore.updateRecordProperty('comments', props.selectedItemKey, 'limits', updatedLimits)
      },
    })

  const cooldownSeconds = createComputed('cooldownSeconds')
  const isRepeatAllowed = createComputed('isRepeatAllowed')
  const cooldownMessage = createComputed('cooldownMessage')
  const repeatMessage = createComputed('repeatMessage')
</script>
