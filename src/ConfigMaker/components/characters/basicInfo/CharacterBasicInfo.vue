<!-- src\ConfigMaker\components\characters\CharacterBasicInfo.vue -->
<template>
  <template v-if="currentData">
    <!-- Key表示 -->
    <SettingItem label="Key" description="キャラクターのキー名">
      <div class="flex gap-2 items-center">
        <div class="flex-grow px-4 py-2 rounded bg-base-200 text-gray-600 whitespace-nowrap overflow-x-auto">
          {{ currentData.key }}
        </div>

        <!-- 編集ボタン -->
        <KeyEditor :currentKey="currentData.key" category="characters" />
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

    <!-- URL -->
    <SettingItem label="Webサイト" description="キャラクターに関連するURL">
      <div class="flex gap-2">
        <input
          v-model="currentData.url"
          type="url"
          class="input input-bordered flex-1 w-full"
          placeholder="https://example.com"
        />
        <ExternalLinkButton v-if="currentData.url" :url="currentData.url" />
      </div>
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/'
  import KeyEditor from '@config/components/KeyEditor/KeyEditor.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import ExternalLinkButton from '@config/components/parts/ExternalLinkButton.vue'

  const props = defineProps<{
    selectedItemKey: string
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 現在のキャラクターデータを取得（読み取り専用）
  const currentData = computed<CharacterType | undefined>(() => {
    if (!props.selectedItemKey) return
    return omikujiStore.getItem('characters', props.selectedItemKey)
  })

  // フィールドを個別に更新する関数
  const updateField = (key: keyof CharacterType, value: string) => {
    if (!props.selectedItemKey) return

    // updateRecordPropertyを使用して特定のフィールドのみ更新
    omikujiStore.updateRecordProperty('characters', props.selectedItemKey, key, value)
  }

  const fields = [
    { key: 'name', label: '設定名', description: '識別しやすい名前' },
    { key: 'description', label: '説明', description: 'キャラクターの紹介文' },
    { key: 'displayName', label: 'ジェネレーターでの表示名', description: '配信時に表示される、BOTの名前' },
  ] as const
</script>
