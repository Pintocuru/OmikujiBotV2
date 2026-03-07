<!-- src/ConfigMaker/components/common/BaseSettingsEditor.vue -->
<template>
  <!-- Key表示 -->
  <SettingItem v-if="isKey" label="キーの名前を変更する" description="他のデータと区別できるよう名前を付けます">
    <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 overflow-x-auto whitespace-nowrap">
        {{ key }}
      </div>
      <!-- 編集ボタン -->
      <KeyEditor v-if="category" :currentKey="key" :category="category" />
    </div>
  </SettingItem>

  <!-- 有効・無効の切り替えボタン -->
  <SettingItem v-if="isIsEnabled" label="イベントを有効にする" description="有効にすると、おみくじができます">
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
  </SettingItem>

  <!-- イベント名 -->
  <SettingItem label="イベント名" description="識別しやすい名前">
    <input type="text" v-model="name" class="input w-full" />
  </SettingItem>

  <!-- 説明 -->
  <SettingItem v-if="isDescription" label="説明" description="このデータの紹介文">
    <input type="text" v-model="description" class="input w-full" />
  </SettingItem>

  <!-- タグ編集 -->
  <BaseTagEditor v-model="tags" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RecordCategoryType } from '@/types/OmikujiData/'
  import BaseTagEditor from './BaseTagEditor.vue'
  import KeyEditor from '@config/components/KeyEditor/KeyEditor.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { BaseRecordType } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      modelValue: BaseRecordType
      category: RecordCategoryType | null
      isKey?: boolean
      isIsEnabled?: boolean
      isDescription?: boolean
      isAccessLevel?: boolean
    }>(),
    {
      isKey: true,
      isIsEnabled: true,
      isDescription: true,
      isAccessLevel: true,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: BaseRecordType]
  }>()

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
  const tags = createComputed('tags')
</script>
