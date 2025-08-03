<!-- src/configMaker/components/wordPartySettings/DeveloperMode.vue -->
<template>
 <div>
  <!-- 開発者モード同意確認 -->
  <div v-if="!agreed" class="card bg-base-300 shadow-lg">
   <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
    開発者モード (config.js読み込み)
   </div>
   <div class="card-body">
    <div class="alert alert-warning mb-4">
     <div>
      <h4 class="font-semibold">⚠️ 開発者モードについて</h4>
      <p class="text-sm mt-2">
       この機能はWordPartyのconfig.jsファイルを読み込みます。<br />
       JavaScriptコードを実行するため、信頼できるファイルのみを使用してください。<br />
       悪意のあるコードが含まれている可能性があります。
      </p>
     </div>
    </div>
    <div class="flex justify-center">
     <button @click="$emit('agree')" class="btn btn-warning">
      理解して開発者モードを有効にする
     </button>
    </div>
   </div>
  </div>

  <!-- WordPartyの config.js 読み込み(開発者モード用) -->
  <div v-if="agreed" class="card bg-base-300 shadow-lg">
   <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
    WordParty config.js 読み込み
   </div>
   <div class="card-body">
    <div class="mb-4">
     <input
      type="file"
      accept=".js"
      @change="handleFile"
      class="file-input file-input-bordered w-full"
     />
    </div>

    <!-- 読み込みステータス -->
    <div v-if="loadStatus" class="mb-4">
     <div :class="['alert', loadStatus.type === 'success' ? 'alert-success' : 'alert-error']">
      {{ loadStatus.message }}
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
defineProps<{
 agreed: boolean;
 loadStatus: { type: 'success' | 'error'; message: string } | null;
}>();

const emit = defineEmits<{
 agree: [];
 load: [content: string];
}>();

// ファイル読み込み処理
function handleFile(event: Event) {
 const input = event.target as HTMLInputElement;
 const file = input.files?.[0];
 if (!file) return;

 const reader = new FileReader();
 reader.onload = () => {
  const content = reader.result as string;
  emit('load', content);
 };

 reader.readAsText(file);
}
</script>
