<!-- src\ConfigMaker\components\common\ThemeColorPicker\DaisyUiThemeEditor.vue -->
<template>
  <!-- グリッド 2列2行 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- テーマカラー -->
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

    <!-- ランダムボタン -->
    <SettingItem label="ランダムボタン" description="カラーをランダムに変更させる">
      <RandomThemeButton @randomize="onRandomize" />
    </SettingItem>

    <!-- 背景(From) -->
    <SettingItem v-if="isAdv" label="背景(From)" description="背景グラデーションの左端の色" forceMode="adv">
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

    <!-- 背景(To) -->
    <SettingItem v-if="isAdv" label="背景(To)" description="背景グラデーションの右端の色" forceMode="adv">
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
  </div>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import RandomThemeButton from './RandomThemeButton.vue'
  import { daisyUIColor, DaisyUiThemeFieldsType, themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    modelValue: DaisyUiThemeFieldsType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: DaisyUiThemeFieldsType]
  }>()

  const { isAdv } = useSettingMode()

  const onUpdate = (key: keyof DaisyUiThemeFieldsType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [key]: value,
    })
  }

  const onRandomize = (randomValues: DaisyUiThemeFieldsType) => {
    emit('update:modelValue', randomValues)
  }
</script>
