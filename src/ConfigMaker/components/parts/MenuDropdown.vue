<!-- src/ConfigMaker/components/parts/MenuDropdown.vue -->
<template>
 <div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost btn-sm">
   <Menu class="w-4 h-4" />
  </label>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
   <li>
    <button @click="$emit('duplicate')" class="text-sm">
     <Copy class="w-4 h-4" />
     複製
    </button>
   </li>
   <li>
    <button @click="$emit('delete')" class="text-sm text-error" :disabled="disableDelete">
     <Trash2 class="w-4 h-4" />
     削除
    </button>
   </li>
  </ul>
 </div>
</template>

<script setup lang="ts">
import { Menu, Copy, Trash2 } from 'lucide-vue-next';

interface Props {
 disableDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
 disableDelete: false
});

defineEmits<{
 duplicate: [];
 delete: [];
}>();
</script>
