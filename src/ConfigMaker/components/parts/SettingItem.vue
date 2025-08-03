<!-- src/ConfigMaker/components/display/SettingItem.vue -->
<template>
 <div class="flex items-center gap-3" :class="containerClass">
  <div class="flex flex-col min-w-32">
   <label class="label-text font-medium">{{ label }}</label>
   <span v-if="description" class="text-xs text-base-content/60">
    {{ description }}
   </span>
  </div>
  <div class="flex-1">
   <slot />
  </div>
  <button
   v-if="showReset"
   class="btn btn-ghost btn-xs"
   @click="$emit('reset')"
   title="デフォルト値に戻す"
  >
   <RotateCcw class="w-3 h-3" />
  </button>
 </div>
</template>

<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';

interface Props {
 label: string;
 description?: string;
 showReset?: boolean;
 containerClass?: string;
}

withDefaults(defineProps<Props>(), {
 showReset: true,
 containerClass: ''
});

defineEmits<{
 reset: [];
}>();
</script>
