<!-- src\ConfigMaker\components\componentEditor\bubble\BubbleCharactersEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- Center (固定表示) -->
    <CharacterSlot
      slot-name="center"
      title="コメント時に表示するキャラクター"
      badge-style="badge-primary"
      :characters="characters"
      :items="editableGroups.center"
      :show-clear="false"
      @update="updateSlot('center', $event)"
    />

    <!-- Slots Grid (2列レイアウト) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Slot 1 : 赤 -->
      <CharacterSlot
        slot-name="slot1"
        title="スロット 1"
        badge-style="bg-red-600 text-white"
        card-style="bg-red-50 border-red-400"
        :characters="characters"
        :items="editableGroups.slot1"
        @update="updateSlot('slot1', $event)"
        @clear="clearSlot('slot1')"
      />

      <!-- Slot 2 : 青 -->
      <CharacterSlot
        v-if="visibleSlots >= 2"
        slot-name="slot2"
        title="スロット 2"
        badge-style="bg-blue-600 text-white"
        card-style="bg-blue-50 border-blue-400"
        :characters="characters"
        :items="editableGroups.slot2"
        @update="updateSlot('slot2', $event)"
        @clear="clearSlot('slot2')"
      />

      <!-- Slot 3 : 緑 -->
      <CharacterSlot
        v-if="visibleSlots >= 3"
        slot-name="slot3"
        title="スロット 3"
        badge-style="bg-green-600 text-white"
        card-style="bg-green-50 border-green-400"
        :characters="characters"
        :items="editableGroups.slot3"
        @update="updateSlot('slot3', $event)"
        @clear="clearSlot('slot3')"
      />

      <!-- Slot 4 : 黄 -->
      <CharacterSlot
        v-if="visibleSlots >= 4"
        slot-name="slot4"
        title="スロット 4"
        badge-style="bg-yellow-500 text-black"
        card-style="bg-yellow-50 border-yellow-400"
        :characters="characters"
        :items="editableGroups.slot4"
        @update="updateSlot('slot4', $event)"
        @clear="clearSlot('slot4')"
      />
    </div>

    <!-- 表示枠の増減ボタン -->
    <div class="flex gap-2">
      <button class="btn btn-sm btn-primary flex-1" :disabled="visibleSlots >= 4" @click="increaseSlots">
        表示枠を増やす
      </button>
      <button class="btn btn-sm btn-outline flex-1" :disabled="visibleSlots <= 1" @click="decreaseSlots">
        表示枠を減らす
      </button>
    </div>

    <div v-if="errorMessage" class="text-error mt-2">
      {{ errorMessage }}
    </div>

    <InformationCard>
      <p>
        <span class="label bg-accent text-accent-content">スロットの仕組み</span>
      </p>
      <p>
        ・スロットはキャラクターキーを並べた配列です。<br />
        ・配列の先頭のキャラクターが通常時に表示されます。<br />
        ・2番目以降のキャラクターは普段は非表示ですが、喋るときに表示されます。
      </p>

      <p>
        <span class="label bg-accent text-accent-content">並べ替え方法</span>
      </p>
      <p>
        ・「表示枠を増やす」を押してスロット数を増やします。<br />
        ・キャラクターをドラッグ＆ドロップして、配列の順番（表示順）を変更できます。
      </p>
    </InformationCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ShowCharactersSchema, type ShowCharacters } from '@/types/'
  import CharacterSlot from './CharacterSlot.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const errorMessage = ref('')
  const visibleSlots = ref(1)

  const bubble = computed(() => data.value.components.bubble)
  const characters = computed(() => data.value.characters)
  const availableCharacters = computed(() => Object.keys(characters.value))

  const editableGroups = ref<ShowCharacters>(ShowCharactersSchema.parse({}))

  // グループの初期化
  const initializeGroups = () => {
    const current = bubble.value.showCharacters
    const allUsedChars = new Set([
      ...current.center,
      ...current.slot1,
      ...current.slot2,
      ...current.slot3,
      ...current.slot4,
    ])
    const unusedChars = availableCharacters.value.filter((char) => !allUsedChars.has(char))

    editableGroups.value = {
      center: Array.from(new Set([...current.center, ...unusedChars])),
      slot1: [...current.slot1],
      slot2: [...current.slot2],
      slot3: [...current.slot3],
      slot4: [...current.slot4],
    }

    // 初期表示スロット数を計算
    if (current.slot4.length > 0) visibleSlots.value = 4
    else if (current.slot3.length > 0) visibleSlots.value = 3
    else if (current.slot2.length > 0) visibleSlots.value = 2
    else visibleSlots.value = 1

    updateStore()
  }

  const updateStore = () => {
    omikujiStore.updateNestedComponents('bubble', {
      ...bubble.value,
      showCharacters: editableGroups.value,
    })
  }

  // スロットを更新
  const updateSlot = (slotName: keyof ShowCharacters, newItems: string[]) => {
    editableGroups.value[slotName] = newItems
    updateStore()
  }

  // スロットをクリア
  const clearSlot = (slotName: keyof ShowCharacters) => {
    if (slotName === 'center') return

    const charsToMove = editableGroups.value[slotName]
    editableGroups.value.center.push(...charsToMove)
    editableGroups.value[slotName] = []

    updateStore()
  }

  // スロットを増やす
  const increaseSlots = () => {
    if (visibleSlots.value < 4) {
      visibleSlots.value++
    }
  }

  // スロットを減らす
  const decreaseSlots = () => {
    if (visibleSlots.value > 1) {
      const slotNames: Array<keyof ShowCharacters> = ['slot4', 'slot3', 'slot2']
      const slotToRemove = slotNames[4 - visibleSlots.value]

      if (slotToRemove) clearSlot(slotToRemove)

      visibleSlots.value--
    }
  }

  onMounted(initializeGroups)
  watch(availableCharacters, initializeGroups, { immediate: false, deep: true })
</script>
