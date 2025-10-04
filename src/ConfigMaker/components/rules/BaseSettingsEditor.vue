<!-- src/configMaker/components/comments/BaseSettingsEditor.vue -->
<template>
  <!-- 開発モード専用 -->
  <div v-if="isGod" class="flex flex-col gap-4">
    <!-- アクセスレベル -->
    <SettingItem label="Access Level" description="製品のアクセスレベルを選択してください" variant="warning">
      <select v-model="accessLevel" class="select select-bordered text-base-content w-full">
        <option v-for="level in AccessLevelLabels" :key="level" :value="level">
          {{ level }}
        </option>
      </select>
    </SettingItem>
  </div>

  <!-- ID表示 -->
  <SettingItem label="キーの名前を変更する" description="他のデータと区別できるよう名前を付けます">
    <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 overflow-x-auto whitespace-nowrap">
        {{ key }}
      </div>
      <!-- 編集ボタン -->
      <IdEditor :currentId="key" :category="category" />
    </div>
  </SettingItem>

  <!-- 有効・無効の切り替えボタン -->
  <SettingItem label="ルールを有効にする" description="有効にすると、おみくじができます">
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
  </SettingItem>

  <!-- ルール名 -->
  <SettingItem label="ルール名" description="識別しやすい名前">
    <input type="text" v-model="name" class="input w-full" />
  </SettingItem>

  <!-- 説明 -->
  <SettingItem label="説明" description="ルールの紹介文">
    <input type="text" v-model="description" class="input w-full" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
  import IdEditor from '@ConfigComponents/parts/IdEditor.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { AccessLevelLabels, BaseRecordType } from '@shared/types'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  const props = defineProps<{
    modelValue: BaseRecordType
    category: RecordCategoryType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: BaseRecordType]
  }>()

  // Store
  const { isGod } = useSettingMode()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof BaseRecordType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value }),
    })

  const key = createComputed('key')
  const name = createComputed('name')
  const description = createComputed('description')
  const isEnabled = createComputed('isEnabled')
  const accessLevel = createComputed('accessLevel')
</script>
