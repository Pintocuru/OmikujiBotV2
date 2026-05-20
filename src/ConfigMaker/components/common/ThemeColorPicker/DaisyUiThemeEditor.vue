<!-- src/ConfigMaker/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- ======= シンプルモード ======= -->
    <template v-if="hasPresets && !advOverride">
      <SettingItem label="テーマ" description="テーマを選択します">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presets"
            :key="preset.label"
            class="btn btn-sm"
            :class="isSelected(preset) ? 'btn-primary' : 'btn-outline'"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>
      </SettingItem>

      <SettingItem v-if="isAdv" label="詳細設定" description="カラーを自由にカスタマイズ">
        <button class="btn btn-sm btn-ghost" @click="advOverride = true">詳細設定を開く →</button>
      </SettingItem>
    </template>

    <!-- ======= 詳細モード ======= -->
    <template v-else>
      <SettingItem v-if="hasPresets" label="表示モード" description="シンプル選択に戻す">
        <button class="btn btn-sm btn-ghost" @click="advOverride = false">← シンプル選択に戻る</button>
      </SettingItem>

      <SettingItem label="テーマカラー" description="DaisyUI のテーマを選択します">
        <select
          class="select select-bordered"
          :value="modelValue.daisyUiTheme"
          @change="onUpdate('daisyUiTheme', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="theme in themes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>
      </SettingItem>

      <SettingItem label="ランダムボタン" description="カラーをランダムに変更させる">
        <RandomThemeButton @randomize="onRandomize" />
      </SettingItem>

      <SettingItem v-if="isAdv" label="第1カラー" description="メインカラー" forceMode="adv">
        <select
          class="select select-bordered"
          :value="modelValue.backFrom"
          @change="onUpdate('backFrom', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="color in daisyUIColor" :key="color" :value="color">
            {{ color }}
          </option>
        </select>
      </SettingItem>

      <SettingItem v-if="isAdv" label="第2カラー" description="サブカラー" forceMode="adv">
        <select
          class="select select-bordered"
          :value="modelValue.backTo"
          @change="onUpdate('backTo', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="color in daisyUIColor" :key="color" :value="color">
            {{ color }}
          </option>
        </select>
      </SettingItem>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import RandomThemeButton from './RandomThemeButton.vue'
  import {
    daisyUIColor,
    themes,
    type DaisyUiThemeFieldsType,
    type DaisyUiThemePresetType,
  } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    modelValue: DaisyUiThemeFieldsType
    presets?: DaisyUiThemePresetType[] | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: DaisyUiThemeFieldsType]
  }>()

  const { isAdv } = useSettingMode()
  const advOverride = ref(false)

  const hasPresets = computed(() => !!props.presets?.length)

  /** プリセットが現在値と一致するか */
  const isSelected = (preset: DaisyUiThemePresetType): boolean =>
    preset.daisyUiTheme === props.modelValue.daisyUiTheme &&
    preset.backFrom === props.modelValue.backFrom &&
    preset.backTo === props.modelValue.backTo

  /** プリセットを適用（label は保存値に含めない） */
  const applyPreset = ({ label: _, ...value }: DaisyUiThemePresetType) => {
    emit('update:modelValue', value)
  }

  const onUpdate = (key: keyof DaisyUiThemeFieldsType, value: string) => {
    emit('update:modelValue', { ...props.modelValue, [key]: value })
  }

  const onRandomize = (randomValues: DaisyUiThemeFieldsType) => {
    emit('update:modelValue', randomValues)
  }
</script>
