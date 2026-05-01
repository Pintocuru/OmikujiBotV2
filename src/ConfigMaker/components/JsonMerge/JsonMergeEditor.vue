<!-- src/ConfigMaker/components/JsonMerge/JsonMergeEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <button @click="addMerge" class="btn btn-primary">
      <Plus class="w-4 h-4" />
      マージ設定を追加
    </button>
  </div>

  <div class="space-y-4">
    <!-- アイテムが空の場合 -->
    <NoParamsCard v-if="merge.length === 0" message="マージ設定がありません。" sub="下のボタンから追加してください。" />

    <!-- ドラッグ可能なアイテムリスト -->
    <VueDraggable
      v-else
      v-model="merge"
      handle=".drag-handle"
      :animation="200"
      class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      @end="update"
    >
      <div
        v-for="(item, index) in merge"
        :key="item.id"
        class="flex items-center gap-2 text-xs bg-base-100 p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
        :class="{ 'bg-primary text-primary-content': selectedId === item.id }"
        @click="selectedId = item.id"
      >
        <!-- ドラッグハンドル -->
        <div class="drag-handle cursor-move flex-shrink-0">
          <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
        </div>

        <!-- 色インジケーター -->
        <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: getColorForIndex(index) }"></div>

        <!-- 名前 -->
        <div class="flex-1 min-w-0">
          <div class="truncate font-medium">{{ item.name || 'マージ設定' }}</div>
          <div class="text-base-content/60 truncate">{{ item.sourceFile || '(ファイル未設定)' }}</div>
        </div>

        <!-- メニュー -->
        <div class="ml-auto" @click.stop>
          <MenuDropdown @duplicate="duplicateItem(item)" @delete="removeItem(item.id)" />
        </div>
      </div>
    </VueDraggable>

    <!-- 選択アイテムの編集エリア -->
    <template v-if="selectedIndex !== null">
      <!-- 帯ヘッダー -->
      <div
        class="flex items-center justify-between px-4 py-2 font-bold text-white rounded-t"
        :style="{ backgroundColor: getColorForIndex(selectedIndex) }"
      >
        <h3 class="text-sm md:text-base">
          マージ設定編集: {{ merge[selectedIndex]?.name || `設定${selectedIndex + 1}` }}
        </h3>
      </div>

      <!-- 詳細編集カード -->

      <div class="space-y-4">
        <!-- イベント名 -->
        <SettingItem label="イベント名" description="識別しやすい名前">
          <input type="text" v-model="merge[selectedIndex].name" @input="update" class="input w-full" />
        </SettingItem>

        <!-- アクセスレベル -->
        <SettingItem label="アクセスレベル" description="ライセンスキーがこのレベル以上ならマージします">
          <select
            v-model="merge[selectedIndex].accessLevel"
            @change="update"
            class="select select-bordered w-full max-w-xs"
          >
            <option v-for="level in AccessLevelLabels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </SettingItem>

        <!-- ファイル選択 & キーサフィックス -->
        <JsonMergeSourceFileSelector :merge-index="selectedIndex" />

        <!-- リマップ設定 -->
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">キーリマップ設定</span>
            <button @click="addRemap(selectedIndex)" class="btn btn-sm btn-primary">+ リマップ追加</button>
          </div>

          <div v-if="merge[selectedIndex].remaps.length === 0" class="text-gray-500 text-sm py-2">
            リマップ設定がありません
          </div>

          <JsonMergeRemapEditor
            v-for="(remap, j) in merge[selectedIndex].remaps"
            :key="j"
            :merge-index="selectedIndex"
            :remap-index="j"
            :characters="characters"
          />
        </div>
      </div>
    </template>

    <!-- 未選択時のメッセージ -->
    <div v-else-if="merge.length > 0" class="card bg-base-200 shadow p-6 text-center">
      <p class="text-base-content/60">上のリストからマージ設定をクリックして編集してください</p>
    </div>

    <!-- 追加ボタン -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { GripVertical, Plus } from 'lucide-vue-next'
  import { CharacterType } from '@/types'
  import { JsonMergeItemSchema, JsonMergeRemapSchema, JsonMergeItemType } from '@/types/OmikujiData/JsonMergeType'
  import JsonMergeRemapEditor from './JsonMergeRemapEditor.vue'
  import JsonMergeSourceFileSelector from './JsonMergeSourceFileSelector.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import { AccessLevelLabels } from '@shared/types'
  import { generateId } from '@shared/types'
  import { storeToRefs } from 'pinia'

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  const merge = ref<JsonMergeItemType[]>(data.value.jsonMerge ?? [])
  const selectedId = ref<string | null>(merge.value[0]?.id ?? null)

  // 選択中のインデックス
  const selectedIndex = computed(() => {
    if (!selectedId.value) return null
    const idx = merge.value.findIndex((v) => v.id === selectedId.value)
    return idx === -1 ? null : idx
  })

  // キャラクターデータ
  const characters = computed(() => {
    return data.value.characters ?? ({} as Record<string, CharacterType>)
  })

  // インデックスに対応した色（OmikujiWeightProgressBarと同じユーティリティを流用）
  const getColorForIndex = (index: number): string => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899']
    return colors[index % colors.length]
  }

  // ストアへ反映
  const update = () => {
    store.updateJsonMerge([...merge.value])
  }

  // 追加
  const addMerge = () => {
    const newItem = JsonMergeItemSchema.parse({})
    merge.value.push(newItem)
    selectedId.value = newItem.id
    update()
  }

  // 複製
  const duplicateItem = (item: JsonMergeItemType) => {
    const id = generateId()
    const duplicated: JsonMergeItemType = {
      ...JSON.parse(JSON.stringify(item)),
      id,
      key: id,
      name: `${item.name}(コピー)`,
    }
    const index = merge.value.findIndex((v) => v.id === item.id)
    merge.value.splice(index + 1, 0, duplicated)
    selectedId.value = duplicated.id
    update()
  }

  // 削除
  const removeItem = (id: string) => {
    const index = merge.value.findIndex((v) => v.id === id)
    merge.value.splice(index, 1)
    // 削除後の選択調整
    if (merge.value.length === 0) {
      selectedId.value = null
    } else if (selectedId.value === id) {
      selectedId.value = merge.value[Math.max(0, index - 1)].id
    }
    update()
  }

  // リマップ追加
  const addRemap = (i: number) => {
    merge.value[i].remaps.push(JsonMergeRemapSchema.parse({}))
    update()
  }
</script>
