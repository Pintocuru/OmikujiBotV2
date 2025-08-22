<!-- src/ConfigMaker/components/meta/PackageBasicInfo.vue -->
<template>
  <SectionCard :variant="isPro ? 'secondary' : 'outline-secondary'">
    <template #header>
      <div>基本情報</div>
      <div class="text-sm pr-2">このおみくじパッケージに関する情報です</div>
    </template>

    <template #body>
      <!-- パッケージ名 -->
      <SettingItem label="パッケージ名" description="テンプレート出力する際に表示する名称" :showReset="false">
        <input
          v-model="meta.name"
          type="text"
          class="input input-bordered w-full max-w-md"
          :class="{ 'input-disabled': !isPro }"
          :disabled="!isPro"
          placeholder="パッケージ名を入力"
        />
      </SettingItem>

      <!-- パッケージ説明 -->
      <SettingItem label="パッケージ説明" description="どんな内容を表示できるかを端的に説明" :showReset="false">
        <input
          v-model="meta.description"
          type="text"
          class="input input-bordered w-full max-w-md"
          :class="{ 'input-disabled': !isPro }"
          :disabled="!isPro"
          placeholder="パッケージの説明を入力"
        />
      </SettingItem>

      <!-- バージョン -->
      <SettingItem label="バージョン" description="パッケージのバージョン情報" :showReset="false">
        <input
          v-model="meta.version"
          type="text"
          class="input input-bordered w-full max-w-md"
          :class="{ 'input-disabled': !isPro }"
          :disabled="!isPro"
          placeholder="例: 1.0.0"
        />
      </SettingItem>

      <!-- 作者 -->
      <SettingItem
        label="作者"
        description="パッケージの作成者名"
        :showReset="isPro"
        @reset="meta.author = 'Pintocuru'"
      >
        <input
          v-model="meta.author"
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
        @reset="meta.tags = ['おみくじBOT']"
      >
        <textarea
          v-model="tagsInput"
          class="textarea textarea-bordered w-full max-w-md h-20"
          :class="{ 'textarea-disabled': !isPro }"
          :disabled="!isPro"
          placeholder="例:&#10;ゲーム&#10;エンターテイメント&#10;配信"
        ></textarea>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useSettingMode } from '@/types/SettingMode'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  //
  const { isPro } = useSettingMode()

  // メタ情報の参照
  const meta = computed({
    get: () => data.value.meta,
    set: (newValue) => {
      omikujiStore.updateMeta(newValue)
    },
  })

  // タグの配列とテキストエリア入力の相互変換（改行区切り）
  const tagsInput = computed({
    get: () => meta.value.tags.join('\n'),
    set: (value: string) => {
      const tags = value
        .split('\n')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      meta.value = {
        ...meta.value,
        tags,
      }
    },
  })
</script>
