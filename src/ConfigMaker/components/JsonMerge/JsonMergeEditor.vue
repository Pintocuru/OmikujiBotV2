<!-- src\ConfigMaker\components\JsonMerge\JsonMergeEditor.vue -->
<template>
  <!-- マージ設定がない場合のメッセージ -->
  <template v-if="merge.length === 0">
    <NoParamsCard message="マージ設定がありません。" sub="下のボタンから追加してください。" />
  </template>

  <!-- 各マージ設定 -->
  <template v-for="(item, i) in merge" :key="i">
    <SectionCard
      icon="Merge"
      :title="merge[i].name"
      description="ビルド時、jsonファイルをマージして出力します"
      :subTitle="merge[i].accessLevel === 'pro' ? 'pro' : merge[i].accessLevel === 'adv' ? 'adv' : 'basic'"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg"></h3>
        <button @click="removeMerge(i)" class="btn btn-sm btn-error" title="この設定を削除">削除</button>
      </div>

      <!-- 基本設定セクション -->
      <div class="space-y-4">
        <!-- ルール名 -->
        <SettingItem label="ルール名" description="識別しやすい名前">
          <input
            type="text"
            v-model="merge[i].name"
            @update:model-value="updateBaseSettings(i, $event)"
            class="input w-full"
          />
        </SettingItem>

        <!-- DaisyUIテーマ -->
        <SettingItem label="アクセスレベル" description="ライセンスキーがこのレベル以上ならマージします">
          <select
            :value="merge[i].accessLevel"
            @change="updateBaseSettings(i, $event)"
            class="select select-bordered w-full max-w-xs"
          >
            <option v-for="theme in AccessLevelLabels" :key="theme" :value="theme">
              {{ theme }}
            </option>
          </select>
        </SettingItem>

        <!-- ファイル選択 & キーサフィックス -->
        <JsonMergeSourceFileSelector :merge-index="i" />

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
    </SectionCard>
  </template>

  <!-- マージ設定追加ボタン -->
  <button @click="addMerge" class="btn btn-primary w-full">+ マージ設定を追加</button>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { CharacterType } from '@/types/'
  import { JsonMergeItemSchema, JsonMergeRemapSchema } from '@/types/OmikujiData/JsonMergeType'
  import JsonMergeRemapEditor from './JsonMergeRemapEditor.vue'
  import JsonMergeSourceFileSelector from './JsonMergeSourceFileSelector.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { AccessLevelLabels } from '@shared/types'

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
