<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\displaySettings\components\BubbleCharactersEditor.vue -->
<template>
  <div class="card bg-base-100">
    <div class="card-body gap-4">
      <h3 class="text-lg font-bold">表示キャラクター設定</h3>

      <!-- 選択済みキャラクター一覧 -->
      <div v-for="(group, groupIndex) in bubble.showCharacters" :key="groupIndex" class="flex gap-2 mb-2">
        <span class="font-semibold">グループ {{ groupIndex + 1 }}</span>
        <div class="flex flex-wrap gap-2">
          <span v-for="charKey in group" :key="charKey" class="badge badge-primary">
            {{ characters[charKey]?.displayName || charKey }}
          </span>
        </div>
        <button class="btn btn-xs btn-error" @click="removeGroup(groupIndex)">削除</button>
      </div>

      <!-- 新しいグループ追加 -->
      <div class="flex gap-2 items-center">
        <select v-model="newGroupSelection" class="select select-bordered">
          <option disabled value="">キャラクターを選択</option>
          <option v-for="charKey in availableCharacters" :key="charKey" :value="charKey">
            {{ characters[charKey].displayName }}
          </option>
        </select>
        <button class="btn btn-sm btn-primary" @click="addGroup">グループ追加</button>
      </div>

      <!-- エラーメッセージ -->
      <div v-if="errorMessage" class="text-error mt-2">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const bubble = computed(() => data.value.displaySettings.components.bubble)
  const characters = computed(() => data.value.characters)

  const newGroupSelection = ref('')
  const errorMessage = ref('')

  // 利用可能なキャラクターキー一覧
  const availableCharacters = computed(() => Object.keys(characters.value))

  // グループ追加処理
  const addGroup = () => {
    if (!newGroupSelection.value) return

    // すでに選択済みかチェック
    const alreadyUsed = bubble.value.showCharacters.flat().includes(newGroupSelection.value)
    if (alreadyUsed) {
      errorMessage.value = '同じキャラクターを複数回選択することはできません'
      return
    }

    const newGroups = [...bubble.value.showCharacters, [newGroupSelection.value]]
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        showCharacters: newGroups,
      },
    })

    newGroupSelection.value = ''
    errorMessage.value = ''
  }

  // グループ削除処理
  const removeGroup = (index: number) => {
    const newGroups = bubble.value.showCharacters.filter((_, i) => i !== index)
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        showCharacters: newGroups,
      },
    })
  }
</script>
