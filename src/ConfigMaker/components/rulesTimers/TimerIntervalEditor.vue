<!-- src/configMaker/components/timers/TimerIntervalEditor.vue -->
<template>
  <SectionCard :isGild="true">
    <template #header>
      <div>タイマー設定</div>
    </template>

    <template #body>
      <!-- プリセット選択 -->
      <SettingItem
        label="実行間隔(30秒～1時間)"
        description="設定した間隔で自動的におみくじが実行されます"
        :showReset="false"
      >
        <select v-model="intervalSeconds" class="select select-bordered w-full">
          <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
            {{ preset.label }}
          </option>
        </select>
      </SettingItem>

      <!-- isBaseZero トグル -->
      <SettingItem label="基準時刻を0分0秒に固定" description="時報などで使えます" :showReset="false">
        <input type="checkbox" class="toggle toggle-primary" v-model="isBaseZero" />
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'

  const props = defineProps<{
    modelValue: {
      intervalSeconds: number
      isBaseZero: boolean
    }
  }>()

  const emit = defineEmits(['update:modelValue'])

  // プリセット定義
  const intervalPresets = [
    { label: '30秒', value: 30 },
    { label: '1分', value: 60 },
    { label: '2分', value: 120 },
    { label: '3分', value: 180 },
    { label: '5分', value: 300 },
    { label: '10分', value: 600 },
    { label: '15分', value: 900 },
    { label: '30分', value: 1800 },
    { label: '1時間', value: 3600 },
  ]

  // 個別のプロパティをcomputedで管理
  const intervalSeconds = computed({
    get: () => props.modelValue.intervalSeconds,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, intervalSeconds: Number(value) })
    },
  })

  const isBaseZero = computed({
    get: () => props.modelValue.isBaseZero,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, isBaseZero: value })
    },
  })

  const formatInterval = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}秒`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分`
    } else {
      const hours = Math.floor(seconds / 3600)
      const remainingMinutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      let result = `${hours}時間`
      if (remainingMinutes > 0) result += `${remainingMinutes}分`
      if (remainingSeconds > 0) result += `${remainingSeconds}秒`

      return result
    }
  }
</script>
