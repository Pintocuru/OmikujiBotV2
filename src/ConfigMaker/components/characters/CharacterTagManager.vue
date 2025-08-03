<!-- src/configMaker/components/characters/CharacterTagManager.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">タグ設定</div>

  <!-- 既存のタグ表示 -->
  <div class="flex flex-wrap gap-2 m-2">
   <span v-for="(tag, index) in tags" :key="index" class="badge badge-primary text-sm gap-1">
    {{ tag }}
    <button @click="removeTag(index)" class="btn btn-xs btn-circle btn-ghost" title="タグを削除">
     <X class="w-3 h-3" />
    </button>
   </span>
  </div>

  <!-- 新しいタグ追加 -->
  <div class="flex gap-2">
   <input
    v-model="newTag"
    type="text"
    placeholder="新しいタグ"
    class="input input-bordered input-sm flex-1"
    @keyup.enter="addTag"
   />
   <button class="btn btn-secondary btn-sm" @click="addTag" :disabled="!newTag.trim()">
    <Plus class="w-4 h-4" />
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Plus } from 'lucide-vue-next';

const props = defineProps<{
 tags: string[];
}>();

const emit = defineEmits<{
 update: [tags: string[]];
}>();

const newTag = ref('');

const addTag = () => {
 const tag = newTag.value.trim();
 if (!tag) return;

 if (props.tags.includes(tag)) {
  alert('このタグは既に追加されています');
  return;
 }

 const updatedTags = [...props.tags, tag];
 emit('update', updatedTags);
 newTag.value = '';
};

const removeTag = (index: number) => {
 const updatedTags = props.tags.filter((_, i) => i !== index);
 emit('update', updatedTags);
};
</script>
