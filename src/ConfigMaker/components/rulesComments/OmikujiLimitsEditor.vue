<!-- src/configMaker/components/comments/OmikujiLimitsEditor.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>おみくじ制限設定</div>
      <div class="text-sm pr-2">重複時や回数超過時におみくじを無効にします</div>
    </template>

    <template #body>
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
          description="空欄でデフォルトが入ります"
          :showReset="true"
          @reset="cooldownMessage = undefined"
        >
          <input
            type="text"
            v-model="cooldownMessage"
            class="input input-bordered w-full"
            placeholder="コメントが被って、「おみくじ」ができなかったよ。またコメントしてね。"
          />
        </SettingItem>
      </div>

      <div class="form-control bg-base-100 p-3 rounded-lg space-y-4">
        <h3 class="font-semibold border-b pb-1">回数制限 - 1回の配信における回数を制限します</h3>
        <SettingItem
          label="引ける回数"
          description="今回のおみくじを引ける最大回数 (0で無制限)"
          :showReset="true"
          @reset="drawLimit = 0"
        >
          <input type="number" v-model.number="drawLimit" min="0" class="input input-bordered w-full" />
        </SettingItem>

        <SettingItem
          v-if="drawLimit > 0"
          label="制限超過時の動作"
          description="引ける回数を超えた時の動作"
          :showReset="true"
          @reset="drawLimitExceeded = 'showMessage'"
        >
          <select v-model="drawLimitExceeded" class="select select-bordered w-full">
            <option value="doNothing">何もしない</option>
            <option value="showMessage">メッセージを表示</option>
            <option value="showLastResult">最後の結果を表示</option>
          </select>
        </SettingItem>

        <SettingItem
          v-if="drawLimit > 0 && drawLimitExceeded === 'showMessage'"
          label="制限超過メッセージ"
          description="空欄でデフォルトが入ります"
          :showReset="true"
          @reset="drawLimitMessage = undefined"
        >
          <input
            type="text"
            v-model="drawLimitMessage"
            class="input input-bordered w-full"
            placeholder="「おみくじ」は上限の5回を超えているよ。"
          />
        </SettingItem>
      </div>

      <div class="form-control bg-base-100 p-3 rounded-lg space-y-4">
        <h3 class="font-semibold border-b pb-1">連投制限 - そのおみくじが同じユーザーで発動する場合、制限します</h3>
        <SettingItem
          label="連投を許可"
          description="続けておみくじを引くことを許可するか"
          :showReset="true"
          @reset="isRepeatAllowed = true"
        >
          <input type="checkbox" v-model="isRepeatAllowed" class="toggle toggle-primary" />
        </SettingItem>

        <SettingItem
          v-if="!isRepeatAllowed"
          label="連投制限メッセージ"
          description="空欄でデフォルトが入ります"
          :showReset="true"
          @reset="repeatMessage = undefined"
        >
          <input
            type="text"
            v-model="repeatMessage"
            class="input input-bordered w-full"
            placeholder="連投制限で「おみくじ」ができなかったよ。"
          />
        </SettingItem>
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiLimitsType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    modelValue: OmikujiLimitsType
    selectedRuleId: string | null
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof OmikujiLimitsType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedRuleId) return
        const updatedLimits = { ...props.modelValue, [key]: value }
        omikujiStore.updateRecordProperty('comments', props.selectedRuleId, 'limits', updatedLimits)
      },
    })

  const cooldownSeconds = createComputed('cooldownSeconds')
  const drawLimit = createComputed('drawLimit')
  const isRepeatAllowed = createComputed('isRepeatAllowed')
  const cooldownMessage = createComputed('cooldownMessage')
  const drawLimitExceeded = createComputed('drawLimitExceeded')
  const drawLimitMessage = createComputed('drawLimitMessage')
  const repeatMessage = createComputed('repeatMessage')
</script>
