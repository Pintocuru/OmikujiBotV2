<!-- src/ConfigMaker/UiEditor/StreamCounter/ColorCycleEditor.vue -->
<template>
  <!-- 単色・奇数カラー -->
  <SettingItem label="単色・奇数カラー" description="基本となるカラーを選択します">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="variant in daisyUIColor"
        :key="variant"
        class="badge cursor-pointer"
        :class="colorCycle[0] === variant ? 'badge-primary' : 'badge-outline'"
        @click="setOddColor(variant)"
      >
        {{ variant }}
      </div>
    </div>
  </SettingItem>

  <!-- 偶数カラー（ツートン2色目） -->
  <SettingItem label="偶数カラー" description="ツートンにする場合の2色目">
    <div class="flex flex-wrap gap-2">
      <!-- 設定しない -->
      <div
        class="badge cursor-pointer"
        :class="colorCycle.length === 1 ? 'badge-primary' : 'badge-outline'"
        @click="clearEvenColor"
      >
        設定しない
      </div>
      <div
        v-for="variant in daisyUIColor"
        :key="variant"
        class="badge cursor-pointer"
        :class="colorCycle.length >= 2 && colorCycle[1] === variant ? 'badge-secondary' : 'badge-outline'"
        @click="setEvenColor(variant)"
      >
        {{ variant }}
      </div>
    </div>
  </SettingItem>

  <!-- 手動入力 -->
  <SettingItem label="カスタム入力" description="カンマ区切りで直接入力" :showReset="true" @reset="onReset">
    <!-- プリセット -->
    <div class="flex flex-wrap gap-1">
      <button
        v-for="(preset, index) in presets"
        :key="index"
        type="button"
        class="btn btn-xs"
        :class="isPresetActive(preset) ? 'btn-primary' : ''"
        @click="applyPreset(preset)"
      >
        プリセット{{ index + 1 }}
      </button>
    </div>
    <input type="text" class="input input-bordered w-full" :value="colorCycle.join(',')" @input="onManualInput" />
    <div class="text-xs text-base-content/50 mt-1">
      現在: {{ colorCycle.length }}色 —
      <span v-for="(c, i) in colorCycle" :key="i" class="badge badge-xs mr-1" :class="`badge-${c}`">{{ c }}</span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { DaisyUIColorType, daisyUIColor } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    colorCycle: DaisyUIColorType[]
  }>()

  const emit = defineEmits<{
    (e: 'update:colorCycle', value: DaisyUIColorType[]): void
  }>()

  const update = (value: DaisyUIColorType[]) => emit('update:colorCycle', value)

  // ---- 単色・奇数カラー ----
  const setOddColor = (variant: DaisyUIColorType) => {
    // 2色目が設定されていれば維持、なければ単色に
    if (props.colorCycle.length >= 2) {
      update([variant, props.colorCycle[1]])
    } else {
      update([variant])
    }
  }

  // ---- 偶数カラー ----
  const clearEvenColor = () => update([props.colorCycle[0]])

  const setEvenColor = (variant: DaisyUIColorType) => update([props.colorCycle[0], variant])

  // ---- プリセット ----
  const presets: DaisyUIColorType[][] = [
    ['info', 'success', 'warning', 'error'],
    ['error', 'warning', 'success', 'accent', 'info', 'primary', 'secondary', 'neutral'],
    ['primary', 'secondary', 'accent', 'warning'],
    ['primary', 'info', 'secondary', 'accent'],
    ['warning', 'error', 'accent', 'success'],
  ]

  const isPresetActive = (preset: DaisyUIColorType[]) =>
    preset.length === props.colorCycle.length && preset.every((v, i) => v === props.colorCycle[i])

  const applyPreset = (colors: DaisyUIColorType[]) => update(colors)

  // ---- 手動入力 ----
  const onManualInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value
    const arr = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s): s is DaisyUIColorType => (daisyUIColor as readonly string[]).includes(s))
    if (arr.length > 0) update(arr)
  }

  // ---- リセット ----
  const onReset = () => update(presets[1])
</script>
