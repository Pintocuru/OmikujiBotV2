<!-- src\ConfigMaker\components\displaySettings\components\BubbleCharactersEditor.vue -->
<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body gap-6 p-4">
      <h3 class="text-lg font-bold text-primary">💬 表示キャラクターグループ設定</h3>

      <draggable
        :list="editableGroups"
        item-key="groupIndex"
        group="groups"
        class="flex flex-wrap gap-4"
        handle=".group-handle"
        @change="handleGroupChange"
      >
        <template #item="{ element: group, index: groupIndex }">
          <div v-if="groupIndex === 0" :key="groupIndex" class="w-full bg-base-200 p-4 rounded-lg shadow-inner">
            <h4 class="text-md font-semibold mb-3 text-secondary">コメント時に表示するキャラクター</h4>

            <draggable
              :list="group"
              item-key="key"
              group="characters"
              class="flex flex-wrap gap-2 p-2 min-h-[50px] border border-dashed border-gray-400 rounded"
              @change="handleCharacterChange"
            >
              <template #item="{ element: charKey }">
                <span class="badge badge-secondary cursor-grab">
                  {{ characters[charKey]?.displayName || charKey }}
                </span>
              </template>
            </draggable>
          </div>

          <div
            v-else
            :key="groupIndex + '-else'"
            class="card bg-base-100 shadow-lg p-3 border border-primary/50 w-full md:w-auto flex-1 min-w-[250px]"
          >
            <div class="flex justify-between items-center mb-2 group-handle cursor-move">
              <h4 class="text-md font-semibold text-primary">グループ {{ groupIndex }}</h4>
              <button class="btn btn-xs btn-error" @click="removeGroup(groupIndex)">削除</button>
            </div>

            <draggable
              :list="group"
              item-key="key"
              group="characters"
              class="flex flex-wrap gap-2 p-2 min-h-[50px] border border-dotted border-gray-400 rounded bg-white"
              @change="handleCharacterChange"
            >
              <template #item="{ element: charKey }">
                <span class="badge badge-primary cursor-grab">
                  {{ characters[charKey]?.displayName || charKey }}
                </span>
              </template>
              <template #footer>
                <div v-if="group.length === 0" class="text-gray-400 italic text-sm">
                  キャラクターをここにドラッグしてください
                </div>
              </template>
            </draggable>
          </div>
        </template>
      </draggable>

      <div class="flex justify-start">
        <button class="btn btn-sm btn-primary w-full" @click="addGroup">空のグループを追加</button>
      </div>

      <div v-if="errorMessage" class="text-error mt-2">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import draggable from 'vuedraggable' // ライブラリをインポート

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // State
  const newGroupSelection = ref('') // 未使用になるが残しておく
  const errorMessage = ref('')

  // Computed properties
  const bubble = computed(() => data.value.displaySettings.components.bubble)
  const characters = computed(() => data.value.characters)
  const availableCharacters = computed(() => Object.keys(characters.value))

  // Draggable 用のローカルなグループリスト (深層コピーでストアへの直接変更を防ぐ)
  const editableGroups = ref<string[][]>([])

  // ----------------------------------------------------
  // 1. **要件対応: showCharacters に availableCharacters をすべて含める**
  // ----------------------------------------------------

  /**
   * showCharacters を初期化・補完する関数。
   * 全ての availableCharacters が showCharacters に含まれることを保証し、
   * 不足分は [0] (未所属グループ) に自動で追加する。
   */
  const initializeGroups = () => {
    const currentGroups = bubble.value.showCharacters
    const allUsedChars = new Set(currentGroups.flat())
    const unusedChars = availableCharacters.value.filter((char) => !allUsedChars.has(char))

    // 0番地グループの取得。なければ空配列。
    const zeroGroup = currentGroups[0] ? [...currentGroups[0]] : []

    // 0番地グループを新しい未使用キャラクターで補完
    const newZeroGroup = Array.from(new Set([...zeroGroup, ...unusedChars])) // 重複を除去して追加

    // 新しいグループリストを作成
    const newGroups = [
      newZeroGroup, // [0] は必ず未所属キャラクタープール
      ...currentGroups.slice(1).map((g) => [...g]), // [1] 以降は現在の設定をコピー
    ]

    // ローカルステートを更新
    editableGroups.value = newGroups

    // ストアを更新
    updateStore(newGroups)
  }

  /**
   * ストアの値を更新する関数
   */
  const updateStore = (newGroups: string[][]) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        showCharacters: newGroups,
      },
    })
  }

  // 初期化と、キャラクターリストの変更を監視して補完処理を実行
  onMounted(initializeGroups)
  watch(availableCharacters, initializeGroups, { immediate: false, deep: true })

  // ----------------------------------------------------
  // 2. Draggable 関連の処理
  // ----------------------------------------------------

  // キャラクターの移動・並べ替え後の処理
  const handleCharacterChange = () => {
    // Draggable で変更されたローカルの editableGroups をそのままストアに反映
    updateStore(editableGroups.value)
  }

  // グループ自体の並べ替え後の処理 (0番地は動かないように設定しているが、念のため)
  const handleGroupChange = (event: any) => {
    // 0番地 (未所属プール) が動かされた場合は無視
    if (event.moved && event.moved.newIndex === 0) {
      // もし 0番地が動いた場合は、強制的に 0番地に戻すために初期化を再度実行 (またはエラーメッセージ表示)
      initializeGroups()
      errorMessage.value = 'グループ 0 (未所属キャラクター) の位置は変更できません。'
      return
    }
    updateStore(editableGroups.value)
  }

  // 空のグループ追加処理
  const addGroup = () => {
    const newGroups = [...editableGroups.value, []]
    editableGroups.value = newGroups
    updateStore(newGroups)
  }

  // グループ削除処理
  const removeGroup = (index: number) => {
    if (index === 0) return // 0番地は削除しない

    // 削除対象グループのキャラクターを 0番地 (未所属プール) に戻す
    const charsToMove = editableGroups.value[index]
    if (charsToMove && editableGroups.value[0]) {
      editableGroups.value[0].push(...charsToMove)
    }

    // グループを削除
    const newGroups = editableGroups.value.filter((_, i) => i !== index)
    editableGroups.value = newGroups

    // ストアを更新
    updateStore(newGroups)
  }
</script>
