<!-- src/ConfigMaker/components/eventsComment/OmikujiLimitsEditor.vue -->
<template>
  <SubSectionHeader
    icon="Ban"
    title="重複処理"
    description="前回の発動からその時間内に発動するおみくじを無効にします"
  />

  <SettingItem
    label="クールダウン時間(秒)"
    description="おみくじを引けるようになるまでの秒数 (0で無効)"
    :showReset="true"
    @reset="cooldownSeconds = 3"
  >
    <div class="flex gap-2">
      <div
        v-for="sec in [0, 3, 5, 10]"
        :key="sec"
        class="badge badge-lg cursor-pointer"
        :class="cooldownSeconds === sec ? 'badge-primary' : 'badge-outline'"
        @click="cooldownSeconds = sec"
      >
        {{ sec ? `${sec}秒` : '0秒(無効)' }}
      </div>
    </div>
  </SettingItem>

  <SettingItem
    v-if="enableSecondary && cooldownSeconds > 0"
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

  <SubSectionHeader
    icon="ShieldAlert"
    title="連投制限"
    description="同じユーザーが続けておみくじを引ける回数を制限します"
  />
  <SettingItem
    label="連投許可回数"
    description="同じユーザーが続けて引ける最大回数 (0で無制限)"
    :showReset="true"
    @reset="isRepeatAllowed = 1"
  >
    <div class="flex gap-2">
      <div
        v-for="n in [0, 1, 2, 3]"
        :key="n"
        class="badge badge-lg cursor-pointer"
        :class="isRepeatAllowed === n ? 'badge-primary' : 'badge-outline'"
        @click="isRepeatAllowed = n"
      >
        {{ n ? `${n}回` : '0回(無効)' }}
      </div>
    </div>
  </SettingItem>

  <SettingItem
    v-if="enableSecondary && isRepeatAllowed > 0"
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiLimitsType } from '@/types/OmikujiData/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const props = defineProps<{
    modelValue: OmikujiLimitsType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateRecordProperty, data } = useOmikujiStore()
  const enableSecondary = computed(() => data.components.enableSecondary)

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof OmikujiLimitsType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updatedLimits = { ...props.modelValue, [key]: value }
        updateRecordProperty('comments', props.selectedItemKey, 'limits', updatedLimits)
      },
    })

  const cooldownSeconds = createComputed('cooldownSeconds')
  const isRepeatAllowed = createComputed('isRepeatAllowed')
  const cooldownMessage = createComputed('cooldownMessage')
  const repeatMessage = createComputed('repeatMessage')
</script>
