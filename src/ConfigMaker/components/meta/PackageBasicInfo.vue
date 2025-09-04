<!-- src/ConfigMaker/components/meta/PackageBasicInfo.vue -->
<template>
  <SectionCard
    :variant="isPro ? 'secondary' : 'outline-secondary'"
    title="基本情報"
    description="このおみくじパッケージに関する情報です"
  >
    <!-- パッケージ名 -->
    <SettingItem label="パッケージ名" description="テンプレート出力する際に表示する名称">
      <input
        v-model="name"
        type="text"
        class="input input-bordered w-full max-w-md"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="パッケージ名を入力"
      />
    </SettingItem>

    <!-- パッケージ説明 -->
    <SettingItem label="パッケージ説明" description="どんな内容を表示できるかを端的に説明">
      <input
        v-model="description"
        type="text"
        class="input input-bordered w-full max-w-md"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="パッケージの説明を入力"
      />
    </SettingItem>

    <!-- バージョン -->
    <SettingItem label="バージョン" description="パッケージのバージョン情報">
      <input
        v-model="version"
        type="text"
        class="input input-bordered w-full max-w-md"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="例: 1.0.0"
      />
    </SettingItem>

    <!-- 作者 -->
    <SettingItem label="作者" description="パッケージの作成者名" :showReset="isPro" @reset="author = 'Pintocuru'">
      <input
        v-model="author"
        type="text"
        class="input input-bordered w-full max-w-md"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="作者名を入力"
      />
    </SettingItem>

    <!-- タグ -->
    <SettingItem
      label="タグ"
      description="パッケージの分類に使用されるタグ（改行区切りで入力）"
      :showReset="isPro"
      @reset="tags = ['おみくじBOT']"
    >
      <textarea
        v-model="tagsInput"
        class="textarea textarea-bordered w-full max-w-md h-20"
        :class="{ 'textarea-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="例:&#10;ゲーム&#10;エンターテイメント&#10;配信"
      ></textarea>
    </SettingItem>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  //
  const { isPro } = useSettingMode()

  // メタデータのプロパティ用computedを生成するヘルパー関数
  const createMetaProperty = <T,>(key: keyof typeof data.value.meta) => {
    return computed({
      get: () => data.value.meta[key] as T,
      set: (value: T) => {
        omikujiStore.updateMeta({
          ...data.value.meta,
          [key]: value,
        })
      },
    })
  }

  // 各プロパティのcomputed
  const name = createMetaProperty<string>('name')
  const description = createMetaProperty<string>('description')
  const version = createMetaProperty<string>('version')
  const author = createMetaProperty<string>('author')
  const tags = createMetaProperty<string[]>('tags')

  // タグの配列とテキストエリア入力の相互変換（改行区切り）
  const tagsInput = computed({
    get: () => tags.value.join('\n'),
    set: (value: string) => {
      const newTags = value
        .split('\n')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      tags.value = newTags
    },
  })
</script>
