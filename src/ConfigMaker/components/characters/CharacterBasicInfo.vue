<!-- src/configMaker/components/characters/CharacterBasicInfo.vue -->
<template>
  <SectionCard v-if="currentData" :isGild="true">
    <template #header>
      <div>基本設定</div>
      <div class="text-sm pr-2">キャラクター、またはカラー設定名の編集を行います。</div>
    </template>

    <template #body>
      <!-- Key表示 -->
      <SettingItem label="Key" description="キャラクターのキー名">
        <div class="flex gap-2 items-center">
          <div class="flex-grow px-4 py-2 rounded bg-base-200 text-gray-600 whitespace-nowrap overflow-x-auto">
            {{ currentData.id }}
          </div>

          <!-- 編集ボタン -->
          <IdEditor :currentId="currentData.id" category="characters" />
        </div>
      </SettingItem>

      <!-- id以外のテキストフィールドループ -->
      <SettingItem v-for="field in fields" :key="field.key" :label="field.label" :description="field.description">
        <input
          type="text"
          class="input input-bordered w-full"
          :value="currentData[field.key] || ''"
          @input="updateField(field.key, ($event.target as HTMLInputElement).value)"
        />
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import IdEditor from '@ConfigComponents/parts/IdEditor.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    selectedRuleId: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 現在のキャラクターデータを取得（読み取り専用）
  const currentData = computed<CharacterType | undefined>(() => {
    if (!props.selectedRuleId) return undefined
    return omikujiStore.getItem<CharacterType>('characters', props.selectedRuleId) ?? undefined
  })

  // フィールドを個別に更新する関数
  const updateField = (key: keyof CharacterType, value: string) => {
    if (!props.selectedRuleId) return

    // updateRecordPropertyを使用して特定のフィールドのみ更新
    omikujiStore.updateRecordProperty('characters', props.selectedRuleId, key, value)
  }

  const fields = [
    { key: 'name', label: '設定名', description: '識別しやすい名前' },
    { key: 'description', label: '説明', description: 'キャラクターの紹介文' },
    {
      key: 'displayName',
      label: 'ジェネレーターでの表示名',
      description: 'BOTちゃんで表示される名前',
    },
    { key: 'author', label: '作者', description: 'キャラクターの設定者名' },
    { key: 'url', label: 'Webサイト', description: 'キャラクターに関連するURL' },
  ] as const
</script>
