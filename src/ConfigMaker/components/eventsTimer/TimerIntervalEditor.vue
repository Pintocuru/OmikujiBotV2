<!-- src/ConfigMaker/components/eventsTimer/TimerIntervalEditor.vue -->
<template>
  <!-- isBaseZero トグル -->
  <SettingItem label="モード" description="タイマーを「起動時のみ」か「一定間隔で継続実行」かを選びます">
    <div class="flex gap-2">
      <!-- 起動時のみ実行 -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="mode === 'onStart' ? 'badge-primary' : 'badge-outline'"
        @click="mode = 'onStart'"
      >
        起動時のみ
      </div>

      <!-- 通常の間隔タイマー -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="mode === 'interval' ? 'badge-primary' : 'badge-outline'"
        @click="mode = 'interval'"
      >
        継続実行
      </div>
    </div>
  </SettingItem>

  <template v-if="mode === 'interval'">
    <!-- プリセット選択 -->
    <SettingItem label="実行間隔(30秒～1時間)" description="設定した間隔で自動的におみくじが実行されます">
      <select v-model="intervalSeconds" class="select select-bordered w-full">
        <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
          {{ preset.label }}
        </option>
      </select>
    </SettingItem>

    <!-- isBaseZero トグル -->
    <SettingItem label="基準時刻を0分0秒に固定" description="時報などで使えます">
      <label class="label cursor-pointer justify-start gap-4">
        <input type="checkbox" class="toggle toggle-primary" v-model="isBaseZero" />
        <span class="label-text">{{ isBaseZero ? '有効（基準時刻を固定）' : '無効（起動時からカウント）' }}</span>
      </label>
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { TimerEventType } from '@/types'

  const props = defineProps<{
    modelValue: {
      mode: TimerEventType['mode']
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

  const mode = computed({
    get: () => props.modelValue.mode,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, mode: value })
    },
  })

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
</script>
