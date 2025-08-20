<!-- src/configMaker/components/comments/BaseSettingsEditor.vue -->
<template>
  <SectionCard :isGild="true">
    <template #header>
      <div>基本設定</div>
      <label class="cursor-pointer flex items-center gap-2">
        <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
        <span class="text-sm">ルールを有効にする</span>
      </label>
    </template>

    <template #body>
      <!-- ID表示(開発モード専用) -->
      <div v-if="isGod" class="alert alert-warning">
        <SettingItem
          label="Access Level"
          description="製品のアクセスレベルを選択してください"
          :showReset="false"
          containerClass="form-control"
        >
          <select v-model="accessLevel" class="select select-bordered text-base-content w-full">
            <option v-for="level in AccessLevelLabels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </SettingItem>
      </div>

      <!-- ID表示(開発モード専用) -->
      <div v-if="isGod" class="p-2 bg-warning text-warning-content rounded-md">
        <SettingItem
          label="Key"
          description="Q.なぜ変更できる? A.マージの時に困らない"
          :showReset="false"
          containerClass="form-control"
        >
          <div class="flex gap-2 items-center">
            <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 overflow-x-auto whitespace-nowrap">
              {{ id }}
            </div>
            <!-- 編集ボタン -->
            <IdEditor :currentId="id" :category="category" />
          </div>
        </SettingItem>
      </div>
      <SettingItem label="ルール名" description="識別しやすい名前" :showReset="false" containerClass="form-control">
        <input type="text" v-model="name" class="input w-full" />
      </SettingItem>

      <SettingItem label="説明" description="ルールの紹介文" :showReset="false" containerClass="form-control">
        <input type="text" v-model="description" class="input w-full" />
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RecordCategoryType, RuleType } from '@/types/OmikujiData/OmikujiDataSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import IdEditor from '@ConfigComponents/parts/IdEditor.vue'
  import { AccessLevelLabels } from '@shared/types'
  import { useSettingMode } from '@/types/SettingMode'

  const props = defineProps<{
    modelValue: RuleType
    category: RecordCategoryType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: RuleType]
  }>()

  // Store
  const { isGod } = useSettingMode()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof RuleType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value }),
    })

  const id = createComputed('id')
  const name = createComputed('name')
  const description = createComputed('description')
  const isEnabled = createComputed('isEnabled')
  const accessLevel = createComputed('accessLevel')
</script>
