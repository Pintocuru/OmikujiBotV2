<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <div v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard
      :isOpen="activeSection === 'basic'"
      @toggle="toggleSection('basic')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      description="プレースホルダー名の設定を行います"
    >
      <!-- ID表示とコピー -->
      <SettingItem label="Key" description="<<プレースホルダー名>>">
        <div class="flex gap-2 items-center">
          <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
            {{ selectedItem.key }}
          </div>
          <!-- コピーボタン -->
          <CopyButton :value="`<<${selectedItem.key}>>`" dataTip="<<プレースホルダー>>の形式で文字列をコピーします" />
          <!-- 編集ボタン -->
          <KeyEditor :currentKey="selectedItem.key" category="placeholders" />
        </div>
      </SettingItem>

      <!-- プレースホルダー名 -->
      <SettingItem label="設定名" description="識別しやすい名前">
        <input type="text" v-model="itemName" placeholder="設定名を入力" class="input input-bordered w-full" />
      </SettingItem>
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard
      :isOpen="activeSection === 'placeholder'"
      @toggle="toggleSection('placeholder')"
      title="プレースホルダー設定"
      :subTitle="`(プレースホルダー数:${selectedItem.values.length}, 総重量:${totalWeight})`"
      description="抽選するプレースホルダーを編集します"
    >
      <PlaceholderValuesEditor :key="selectedItem.id" :placeholderKey="selectedItem.key" />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PlaceholderType } from '@/types'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import KeyEditor from '@/ConfigMaker/components/parts/KeyEditor/KeyEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CopyButton from '@ConfigComponents/parts/CopyButton.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'basic' | 'placeholder' | null
  const activeSection = ref<SectionType>('basic') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    // 同じセクションをクリックした場合は閉じる、違うセクションの場合は切り替える
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedItemKey } = storeToRefs(omikujiStore)

  // 選択されたアイテムの取得（読み取り専用）
  const selectedItem = computed(() => {
    if (!selectedItemKey.value) return null
    return data.value.placeholders[selectedItemKey.value]
  })

  // 総重量を計算するcomputed
  const totalWeight = computed(() => {
    if (!selectedItem.value) return 0
    return selectedItem.value.values.reduce((sum, v) => {
      if (typeof v === 'string') return sum
      return sum + (v.weight ?? 0)
    }, 0)
  })

  // プレースホルダーのプロパティ用computedを生成するヘルパー関数
  const createPlaceholderProperty = <T,>(key: keyof PlaceholderType) => {
    return computed({
      get: () => {
        if (!selectedItem.value) return '' as T
        return selectedItem.value[key] as T
      },
      set: (value: T) => {
        if (!selectedItem.value) return
        const updatedItem = {
          ...selectedItem.value,
          [key]: value,
        }
        omikujiStore.updateItem('placeholders', selectedItem.value.key, updatedItem)
      },
    })
  }

  // 各プロパティのcomputed
  const itemName = createPlaceholderProperty<string>('name')
</script>
