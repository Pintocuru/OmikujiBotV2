<!-- src/ConfigMaker/components/componentEditor/FlightSeat/CustomLayoutEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセット選択 -->
    <SettingItem label="プリセット" description="よく使われる配置パターンから選択">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(preset, key) in customLayoutPresets"
          :key="key"
          class="badge badge-lg cursor-pointer gap-1"
          :class="isSelectedPreset(key) ? 'badge-primary' : 'badge-outline'"
          @click="applyPreset(key)"
        >
          <span>{{ preset.emoji }}</span>
          <span>{{ preset.label }}</span>
        </div>
      </div>
    </SettingItem>

    <!-- カスタム配列入力 -->
    <SettingItem
      label="カスタム配列"
      description="各段の座席数を配列で指定 (例: [1,2,3,4,5])"
      :showReset="true"
      @reset="resetToDefault"
    >
      <div class="space-y-2">
        <input
          type="text"
          class="input input-bordered w-full font-mono"
          :value="customLayoutString"
          @input="updateCustomLayout"
          placeholder="[1,2,3,4,5]"
        />
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import {
    customLayoutPresets,
    type CustomLayoutPresetKey,
    layoutArrayToString,
    layoutStringToArray,
    getPresetLayout,
  } from './customLayoutPresets'

  const props = defineProps<{
    customLayoutString: string
  }>()

  const emit = defineEmits<{
    update: [value: string]
  }>()

  // 文字列を配列にパース
  const parsedLayout = computed(() => {
    return layoutStringToArray(props.customLayoutString)
  })

  // カスタム配列からの総座席数
  const totalSeatsFromCustom = computed(() => {
    return parsedLayout.value.reduce((sum, n) => sum + n, 0)
  })

  // 現在の配列が特定のプリセットと一致するかチェック
  const isSelectedPreset = (presetKey: CustomLayoutPresetKey) => {
    const presetLayout = getPresetLayout(presetKey)
    const current = parsedLayout.value
    return presetLayout.length === current.length && presetLayout.every((val, idx) => val === current[idx])
  }

  // プリセット適用
  const applyPreset = (presetKey: CustomLayoutPresetKey) => {
    const layout = getPresetLayout(presetKey)
    emit('update', layoutArrayToString(layout))
  }

  // カスタム配列の更新
  const updateCustomLayout = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    emit('update', value)
  }

  // デフォルトにリセット
  const resetToDefault = () => {
    emit('update', layoutArrayToString([1, 2, 3, 4, 5]))
  }
</script>
