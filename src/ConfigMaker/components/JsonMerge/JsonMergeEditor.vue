<!-- src/configMaker/components/characters/CharacterEditor.vue -->
<template>
  <SectionCard
    :isOpen="true"
    title="JSONマージ（開発者専用）"
    description="ビルド時、jsonファイルをマージして出力します"
  >
    <div class="space-y-4">
      <!-- マージ設定がない場合のメッセージ -->
      <div v-if="merge.length === 0" class="text-gray-500 text-center py-8">
        マージ設定がありません。下のボタンから追加してください。
      </div>

      <!-- 各マージ設定 -->
      <div v-for="(item, i) in merge" :key="i" class="border rounded-lg p-4 bg-base-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-lg">マージ設定 {{ i + 1 }}</h3>
          <button @click="removeMerge(i)" class="btn btn-sm btn-error" title="この設定を削除">削除</button>
        </div>

        <!-- ファイル選択 -->
        <SettingItem label="マージ元ファイル">
          <select v-model="merge[i].sourceFile" @change="update" class="select select-bordered w-full">
            <option value="">ファイルを選択してください</option>
            <option v-for="file in jsonFiles" :key="file" :value="file">
              {{ file }}
            </option>
          </select>
        </SettingItem>

        <!-- リマップ設定 -->
        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">キーリマップ設定</span>
            <button @click="addRemap(i)" class="btn btn-sm btn-primary">+ リマップ追加</button>
          </div>

          <div v-if="item.remaps.length === 0" class="text-gray-500 text-sm py-2">リマップ設定がありません</div>

          <div
            v-for="(remap, j) in item.remaps"
            :key="j"
            class="border-l-4 border-primary pl-4 py-2 mb-3 bg-base-200 rounded"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">リマップ {{ j + 1 }}</span>
              <button @click="removeRemap(i, j)" class="btn btn-xs btn-ghost" title="このリマップを削除">✕</button>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <SettingItem label="元キャラキー">
                <input
                  type="text"
                  v-model="merge[i].remaps[j].fromCharacterKey"
                  @input="update"
                  class="input input-sm input-bordered w-full"
                  placeholder="old_character"
                />
              </SettingItem>

              <SettingItem label="新キャラキー">
                <input
                  type="text"
                  v-model="merge[i].remaps[j].toCharacterKey"
                  @input="update"
                  class="input input-sm input-bordered w-full"
                  placeholder="new_character"
                />
              </SettingItem>

              <SettingItem label="元アイコンキー">
                <input
                  type="text"
                  v-model="merge[i].remaps[j].fromIconKey"
                  @input="update"
                  class="input input-sm input-bordered w-full"
                  placeholder="old_icon"
                />
              </SettingItem>

              <SettingItem label="新アイコンキー">
                <input
                  type="text"
                  v-model="merge[i].remaps[j].toIconKey"
                  @input="update"
                  class="input input-sm input-bordered w-full"
                  placeholder="new_icon"
                />
              </SettingItem>
            </div>
          </div>
        </div>
      </div>

      <!-- マージ設定追加ボタン -->
      <button @click="addMerge" class="btn btn-primary w-full">+ マージ設定を追加</button>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  const merge = ref(data.value.jsonMerge ?? [])
  const jsonFiles = ref<string[]>([])

  // JSONファイルリストを取得
  onMounted(async () => {
    try {
      const res = await fetch('/api/dev-configs/list')
      if (res.ok) {
        const files = await res.json()
        jsonFiles.value = files.map((f: any) => f.name || f)
      }
    } catch (err) {
      console.error('JSONファイル取得エラー:', err)
    }
  })

  // 更新をストアに反映
  const update = () => {
    store.updateJsonMerge([...merge.value])
  }

  // マージ設定を追加
  const addMerge = () => {
    merge.value.push({
      sourceFile: '',
      remaps: [],
    })
    update()
  }

  // マージ設定を削除
  const removeMerge = (i: number) => {
    merge.value.splice(i, 1)
    update()
  }

  // リマップを追加
  const addRemap = (i: number) => {
    merge.value[i].remaps.push({
      fromCharacterKey: '',
      toCharacterKey: '',
      fromIconKey: '',
      toIconKey: '',
    })
    update()
  }

  // リマップを削除
  const removeRemap = (i: number, j: number) => {
    merge.value[i].remaps.splice(j, 1)
    update()
  }
</script>
