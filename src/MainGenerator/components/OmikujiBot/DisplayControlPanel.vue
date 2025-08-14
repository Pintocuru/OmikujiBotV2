<!-- src\MainGenerator\components\OmikujiBot\DisplayControlPanel.vue -->
<template>
 <div
  class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
  @mouseenter="showPanel = true"
  @mouseleave="showPanel = false"
 >
  <!-- ホバーエリア -->
  <div class="w-60 h-32 pointer-events-auto"></div>

  <!-- コントロールパネル -->
  <Transition name="panel-fade">
   <div
    v-if="showPanel"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border-2 border-indigo-600 rounded-xl p-6 min-w-[28rem] pointer-events-auto backdrop-blur-lg shadow-2xl transition-all duration-300 ease-out scale-100 opacity-100"
    :class="{ 'scale-90 opacity-0': !showPanel }"
   >
    <!-- 表示モード -->
    <div class="mb-5">
     <h3 class="text-white text-base font-bold mb-3 text-center">表示モード</h3>
     <div class="grid grid-cols-3 gap-2 mb-4">
      <button
       v-for="(scriptKey, index) in availableScriptKeys"
       :key="`mode-${index}`"
       @click="switchToMode(scriptKey)"
       :class="getButtonClass(currentScriptKey === scriptKey)"
      >
       {{ getModeLabel(scriptKey) }}
      </button>
     </div>
    </div>

    <!-- 表示サイズ -->
    <div class="mb-5">
     <h3 class="text-white text-base font-bold mb-3 text-center">表示サイズ</h3>
     <div class="grid grid-cols-5 gap-1.5">
      <button
       v-for="size in displaySizeOptions"
       :key="size"
       @click="setDisplaySize(size)"
       :class="getButtonClass(displaySize === size, true)"
      >
       {{ displaySizeLabels[size] }}
      </button>
     </div>
    </div>
   </div>
  </Transition>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DisplaySize, displaySizeLabels } from '@shared/types';
import { useDisplayStore } from '@/MainGenerator/stores';
import { storeToRefs } from 'pinia';

// ストアから状態と関数を取得
const displayStore = useDisplayStore();
const { availableScriptKeys, currentScriptKey, displaySize } = storeToRefs(displayStore);
const { switchToMode, setDisplaySize } = displayStore;

const showPanel = ref(false);
const displaySizeOptions: DisplaySize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const getModeLabel = (scriptKey: string | null): string =>
 scriptKey === null
  ? 'BOTちゃん'
  : scriptKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

const baseBtnClass =
 'rounded-lg text-white font-semibold cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:bg-opacity-30 hover:border-indigo-600';

const getButtonClass = (isActive: boolean, small = false) => {
 return [
  baseBtnClass,
  small ? 'text-xs py-2 px-1' : 'text-sm py-3 px-2',
  isActive
   ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40'
   : 'bg-gray-700/30 border-white border-opacity-20 text-white/80'
 ];
};
</script>
