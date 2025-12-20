<!-- src\ConfigMaker\components\characters\color\DaisyUiThemeEditor.vue -->
<template>
  <div class="card bg-base-100 flex flex-col gap-4">
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

    <!-- 背景の左端 -->
    <div v-if="isPro" class="flex flex-col gap-4">
      <SettingItem label="背景(From)" description="背景グラデーションの左端の色" forceMode="pro">
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

      <!-- 背景の右端 -->
      <SettingItem label="背景(To)" description="背景グラデーションの右端の色" forceMode="pro">
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
  </div>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { daisyUIColor, DaisyUiThemeFieldsType, themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  const props = defineProps<{
    modelValue: DaisyUiThemeFieldsType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: DaisyUiThemeFieldsType]
  }>()

  const { isPro } = useSettingMode()

  const onUpdate = (key: keyof DaisyUiThemeFieldsType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [key]: value,
    })
  }
</script>
