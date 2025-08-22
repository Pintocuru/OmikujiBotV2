<!-- src/configMaker/components/comments/BaseSettingsEditor.vue -->
<template>
  <SectionCard :variant="isEnabled ? 'secondary' : 'outline-secondary'">
    <template #header>
      <div>基本設定</div>
      <div class="text-sm pr-2">機能のON/OFFや名称の設定を行います</div>
    </template>

    <template #body>
      <!-- ID表示(開発モード専用) -->
      <div v-if="isGod" class="flex flex-col gap-4">
        <SettingItem
          label="Access Level"
          description="製品のアクセスレベルを選択してください"
          :showReset="false"
          variant="warning"
        >
          <select v-model="accessLevel" class="select select-bordered text-base-content w-full">
            <option v-for="level in AccessLevelLabels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </SettingItem>

        <!-- ID表示(開発モード専用) -->
        <SettingItem
          label="Key"
          description="Q.なぜ変更できる? A.マージの時に困らない"
          :showReset="false"
          variant="warning"
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

      <!-- 有効・無効の切り替えボタン -->
      <SettingItem label="ルールを有効にする" description="有効にすると、おみくじができます" :showReset="false">
        <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
      </SettingItem>

      <!-- ルール名 -->
      <SettingItem label="ルール名" description="識別しやすい名前" :showReset="false">
        <input type="text" v-model="name" class="input w-full" />
      </SettingItem>

      <!-- 説明 -->
      <SettingItem label="説明" description="ルールの紹介文" :showReset="false">
        <input type="text" v-model="description" class="input w-full" />
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RuleType } from '@/types/OmikujiData/RulesSchema'
  import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
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
