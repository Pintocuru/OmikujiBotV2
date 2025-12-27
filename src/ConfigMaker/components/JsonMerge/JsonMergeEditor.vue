<!-- src\ConfigMaker\components\JsonMerge\JsonMergeEditor.vue -->
<template>
  <SectionCard
    icon="Merge"
    :isOpen="true"
    title="JSONマージ"
    description="ビルド時、jsonファイルをマージして出力します"
  >
    <div class="space-y-4">
      <!-- マージ設定がない場合のメッセージ -->
      <div v-if="merge.length === 0" class="text-gray-500 text-center py-8">
        <NoParamsCard message="マージ設定がありません。" sub="下のボタンから追加してください。" />
      </div>

      <!-- 各マージ設定 -->
      <div v-for="(item, i) in merge" :key="i" class="border rounded-lg p-4 bg-base-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-lg">{{ merge[i].name }}</h3>
          <button @click="removeMerge(i)" class="btn btn-sm btn-error" title="この設定を削除">削除</button>
        </div>

        <div class="space-y-4">
          <!-- 基本設定セクション -->
          <BaseSettingsEditor
            :model-value="merge[i]"
            @update:model-value="updateBaseSettings(i, $event)"
            :category="null"
            :isKey="false"
            :isIsEnabled="false"
            :isDescription="false"
          />

          <!-- ファイル選択 & キーサフィックス -->
          <JsonMergeSourceFileSelector :merge-index="i" />
        </div>

        <!-- リマップ設定 -->
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">キーリマップ設定</span>
            <button @click="addRemap(i)" class="btn btn-sm btn-primary">+ リマップ追加</button>
          </div>

          <div v-if="item.remaps.length === 0" class="text-gray-500 text-sm py-2">リマップ設定がありません</div>

          <JsonMergeRemapEditor
            v-for="(remap, j) in item.remaps"
            :key="j"
            :merge-index="i"
            :remap-index="j"
            :characters="characters"
          />
        </div>
      </div>

      <!-- マージ設定追加ボタン -->
      <button @click="addMerge" class="btn btn-primary w-full">+ マージ設定を追加</button>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { CharacterType } from '@/types'
  import { JsonMergeItemSchema, JsonMergeRemapSchema } from '@/types/OmikujiData/JsonMergeType'
  import JsonMergeRemapEditor from './JsonMergeRemapEditor.vue'
  import JsonMergeSourceFileSelector from './JsonMergeSourceFileSelector.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import BaseSettingsEditor from '@ConfigComponents/common/BaseSettingsEditor.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  const merge = ref(data.value.jsonMerge ?? [])

  // Characterデータを計算プロパティで取得
  const characters = computed(() => {
    return data.value.characters ?? ({} as Record<string, CharacterType>)
  })

  // 更新をストアに反映
  const update = () => {
    store.updateJsonMerge([...merge.value])
  }

  // BaseSettingsEditorからの更新を処理（共通コンポーネントなので親で処理）
  const updateBaseSettings = (i: number, newSettings: any) => {
    merge.value[i] = { ...merge.value[i], ...newSettings }
    update()
  }

  // マージ設定を追加
  const addMerge = () => {
    merge.value.push(JsonMergeItemSchema.parse({}))
    update()
  }

  // マージ設定を削除
  const removeMerge = (i: number) => {
    merge.value.splice(i, 1)
    update()
  }

  // リマップを追加
  const addRemap = (i: number) => {
    merge.value[i].remaps.push(JsonMergeRemapSchema.parse({}))
    update()
  }
</script>
