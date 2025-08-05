<!-- src/configMaker/components/placeholders/PlaceholderList.vue -->
<template>
 <div class="card bg-base-300">
  <h3 class="card-title bg-primary text-lg p-2 pl-4 rounded-t text-white">プレースホルダー一覧</h3>

  <div class="card-body p-2">
   <!-- 検索バー -->
   <div class="form-control">
    <input
     type="text"
     v-model="searchQuery"
     :placeholder="`プレースホルダーを検索... (${filteredPlaceholders.length}/${allPlaceholders.length}件)`"
     class="input input-bordered input-sm w-full"
    />
   </div>

   <!-- リスト表示（コンパクト） -->
   <div class="space-y-1 max-h-48 overflow-y-auto">
    <div
     v-for="placeholder in filteredPlaceholders"
     :key="placeholder.id"
     :class="[
      'card card-compact transition-colors',
      isPlaceholderUsed(placeholder.id)
       ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30'
       : 'bg-base-100 hover:bg-base-200'
     ]"
    >
     <div class="flex items-center justify-between p-2 gap-3">
      <div class="flex-1 min-w-0">
       <div class="flex items-center gap-2">
        <span class="font-medium text-sm truncate">{{ placeholder.name || placeholder.id }}</span>
        <code class="bg-base-200 px-1 py-0.5 rounded text-xs">ID : {{ placeholder.id }}</code>
        <div class="badge badge-outline badge-xs">{{ placeholder.values.length }}</div>
        <!-- 使用中の場合はバッジを表示 -->
        <div v-if="isPlaceholderUsed(placeholder.id)" class="badge badge-primary badge-xs">
         使用中
        </div>
       </div>
       <div class="text-xs text-base-content/60 truncate mt-0.5">
        {{ getRandomValue(placeholder) }}
       </div>
      </div>

      <div class="flex items-center gap-1">
       <CopyButton :value="`<<${placeholder.id}>>`" dataTip="IDをコピー" class="btn-xs" />
       <PlaceholderModal
        v-if="!isDefaultPlaceholder(placeholder.id)"
        :placeholderId="placeholder.id"
       />
      </div>
     </div>
    </div>
   </div>

   <!-- プレースホルダーが見つからない場合 -->
   <div v-if="filteredPlaceholders.length === 0" class="text-center py-8 text-base-content/60">
    <div class="text-4xl mb-2">📋</div>
    <div v-if="searchQuery" class="text-sm">
     「{{ searchQuery }}」に一致するプレースホルダーが見つかりません
    </div>
    <div v-else class="text-sm">プレースホルダーがありません</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
 DefaultPlaceholders,
 defaultPlaceholdersLabels,
 PlaceholderSchema,
 PlaceholderType,
 PostActionType
} from '@/types/';
import PlaceholderModal from './PlaceholderModal.vue';
import { usePlaceholderStore } from '@ConfigStore/usePlaceholderStore';
import { useCommentRulesStore } from '@ConfigStore/useCommentRulesStore';
import CopyButton from '@ConfigComponents/parts/CopyButton.vue';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';

// Props
const props = defineProps<{
 actions: PostActionType[];
}>();

// Store
const placeholderStore = usePlaceholderStore();
const commentRulesStore = useCommentRulesStore();

// computed
const selectedRule = computed(() => commentRulesStore.selectedRule);

// リアクティブな状態
const searchQuery = ref('');

// デフォルトで入るプレースホルダー：user, lc, tc
const placeholderContentMap = new Map<DefaultPlaceholders, string>([
 ['user', '(ユーザー名)'],
 ['price', '(ギフト金額)'],
 ['lc', '(コメント番号)'],
 ['tc', '(個人コメント数)'],
 ['viewer', '(視聴ユーザー数)'],
 ['upVote', '(高評価数)']
]);

// デフォルトで入るプレースホルダー：user, lc, tc
const defaultPlaceholders: PlaceholderType[] = (
 Object.keys(defaultPlaceholdersLabels) as DefaultPlaceholders[]
).map((id) => {
 // MapからcontentValueを取得。もし存在しない場合は空文字列をデフォルトとする
 const contentValue = placeholderContentMap.get(id) ?? '';

 return PlaceholderSchema.parse({
  id: id,
  name: defaultPlaceholdersLabels[id],
  values: [{ content: contentValue }]
 });
});
// デフォルトプレースホルダーのIDを配列で取得
const defaultPlaceholderIds = defaultPlaceholders.map((p) => p.id);

// 指定したIDがデフォルトプレースホルダーかどうかを判定
const isDefaultPlaceholder = (id: string) => {
 return defaultPlaceholderIds.includes(id);
};

// 現在選択されているおみくじにゲームスクリプトが使われているなら、そのプレースホルダーを取得する
const scriptPlaceholder = computed((): PlaceholderType[] => {
 if (!selectedRule.value?.scriptId) return [];

 const script = gameScriptMap[selectedRule.value.scriptId];
 return (
  script.placeholders?.map(
   (item): PlaceholderType =>
    PlaceholderSchema.parse({
     id: item.key,
     name: item.name,
     order: 0,
     values: [{ content: item.value }]
    })
  ) || []
 );
});

// プレースホルダーが使用されているかを判定する関数
const isPlaceholderUsed = (placeholderId: string): boolean => {
 const placeholderPattern = `<<${placeholderId}>>`;

 return props.actions.some(
  (action) =>
   action.wordParty?.includes(placeholderPattern) ||
   action.messageContent?.includes(placeholderPattern) ||
   action.messageToast?.includes(placeholderPattern)
 );
};

// ランダムな値を取得する関数
const getRandomValue = (placeholder: PlaceholderType) => {
 if (!placeholder.values || placeholder.values.length === 0) return '';
 const randomIndex = Math.floor(Math.random() * placeholder.values.length);
 return placeholder.values[randomIndex]?.content || '';
};

// 全プレースホルダーを取得
const allPlaceholders = computed(() => {
 const placeholdersOld = placeholderStore.rulesArray;
 const scriptPlaceholders = scriptPlaceholder.value || [];
 const placeholders = [
  ...Object.values(defaultPlaceholders),
  ...scriptPlaceholders,
  ...placeholdersOld
 ];

 // 優先するIDとその順位
 const priorityOrder: Record<DefaultPlaceholders, number> & { [key: string]: number | undefined } =
  {
   user: 1,
   price: 2,
   lc: 3,
   tc: 4,
   viewer: 5,
   upVote: 6
  };

 // スクリプトプレースホルダーのIDセットを作成
 const scriptPlaceholderIds = new Set(scriptPlaceholders.map((p) => p.id));

 return placeholders.sort((a, b) => {
  const aUsed = isPlaceholderUsed(a.id);
  const bUsed = isPlaceholderUsed(b.id);
  const aIsScript = scriptPlaceholderIds.has(a.id);
  const bIsScript = scriptPlaceholderIds.has(b.id);

  // 1. 使用中のものが最優先
  if (aUsed && !bUsed) return -1;
  if (!aUsed && bUsed) return 1;

  // 2. 使用中でない場合、スクリプトプレースホルダーが次に優先
  if (!aUsed && !bUsed) {
   if (aIsScript && !bIsScript) return -1;
   if (!aIsScript && bIsScript) return 1;
  }

  // 3. 優先IDがあるものが次にくる（デフォルトプレースホルダー）
  const aPriority = priorityOrder[a.id] ?? Number.MAX_SAFE_INTEGER;
  const bPriority = priorityOrder[b.id] ?? Number.MAX_SAFE_INTEGER;

  if (aPriority !== bPriority) {
   return aPriority - bPriority;
  }

  // 4. 名前順（名前がない場合はID順）
  const aName = a.name || a.id;
  const bName = b.name || b.id;
  return aName.localeCompare(bName);
 });
});

// フィルタリングされたプレースホルダー
const filteredPlaceholders = computed(() => {
 if (!searchQuery.value) {
  return allPlaceholders.value;
 }

 const query = searchQuery.value.toLowerCase();
 return allPlaceholders.value.filter((placeholder) => {
  const name = (placeholder.name || '').toLowerCase();
  const id = placeholder.id.toLowerCase();
  const content = placeholder.values.map((v) => v.content.toLowerCase()).join(' ');

  return name.includes(query) || id.includes(query) || content.includes(query);
 });
});
</script>
