<!-- src/configMaker/components/comments/CharacterBulkChanger.vue -->
<template>
 <div>
  <!-- トリガーボタン -->
  <div class="tooltip tooltip-bottom" data-tip="このおみくじのキャラクターを変更する">
   <button @click="openModal" class="btn btn-ghost btn-sm">
    <Users class="w-4 h-4" />キャラ変更
   </button>
  </div>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
   <div class="modal-box">
    <h3 class="font-bold text-lg mb-4">キャラクター一括変更</h3>

    <div class="space-y-4">
     <!-- 現在のキャラクター情報 -->
     <div class="bg-base-200 p-3 rounded">
      <p class="text-sm text-gray-600 mb-2">現在使用されているキャラクター:</p>
      <div class="flex flex-wrap gap-2">
       <span v-for="charKey in uniqueCharacterKeys" :key="charKey" class="badge badge-outline">
        {{ getCharacterName(charKey) || charKey || '未設定' }}
       </span>
      </div>
     </div>

     <!-- 変更先キャラクター選択 -->
     <div class="form-control">
      <label class="label">
       <span class="label-text">変更先のキャラクター</span>
      </label>
      <select v-model="selectedCharacterId" class="select select-bordered w-full">
       <option value="">キャラクターを選択してください</option>
       <option v-for="character in charactersArray" :key="character.id" :value="character.id">
        {{ character.name || character.id }}
       </option>
      </select>
     </div>

     <!-- 確認メッセージ -->
     <div v-if="selectedCharacterId" class="alert alert-warning">
      <AlertTriangle class="w-4 h-4" />
      <span class="text-sm">
       すべてのおみくじセット内のキャラクターが「{{
        getCharacterName(selectedCharacterId)
       }}」に変更されます。 この操作は元に戻せません。
      </span>
     </div>
    </div>

    <!-- モーダルアクション -->
    <ModalFooterActions
     :on-cancel="closeModal"
     :on-save="changeAllCharacters"
     :saveName="'変更実行'"
     :disabled="!selectedCharacterId"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OmikujiSetType } from '@/types/';
import { useCharacterStore } from '@ConfigStores/useCharacterStore';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import { Users, AlertTriangle } from 'lucide-vue-next';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';

const props = defineProps<{
 modelValue: OmikujiSetType[];
}>();

const emit = defineEmits<{
 'update:modelValue': [value: OmikujiSetType[]];
}>();

// ストアを使用
const omikujiStore = useOmikujiStore();
const charactersArray = computed(() =>
 omikujiStore.getCategoryArray('characters').sort((a, b) => a.order - b.order)
);

// モーダル状態
const isModalOpen = ref(false);
const selectedCharacterId = ref('');

// 現在使用されているキャラクターキーを取得
const uniqueCharacterKeys = computed(() => {
 const keys = new Set<string>();
 props.modelValue.forEach((omikuji) => {
  omikuji.postActions?.forEach((action) => {
   if (action.characterKey) {
    keys.add(action.characterKey);
   }
  });
 });
 return Array.from(keys);
});

// キャラクター名を取得
const getCharacterName = (characterId: string): string => {
 const character = charactersArray.value.find((char) => char.id === characterId);
 return character?.name || '';
};

// モーダル開閉
const openModal = () => {
 isModalOpen.value = true;
 selectedCharacterId.value = '';
};

const closeModal = () => {
 isModalOpen.value = false;
 selectedCharacterId.value = '';
};

// キャラクター一括変更
const changeAllCharacters = () => {
 if (!selectedCharacterId.value) return;

 const newValue = props.modelValue.map((omikuji) => ({
  ...omikuji,
  postActions:
   omikuji.postActions?.map((action) => ({
    ...action,
    characterKey: selectedCharacterId.value
   })) || []
 }));

 emit('update:modelValue', newValue);
 closeModal();
};
</script>
