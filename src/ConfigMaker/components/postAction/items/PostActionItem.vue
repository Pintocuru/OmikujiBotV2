<!-- src\ConfigMaker\components\postAction\items\PostActionItem.vue -->
<template>
  <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
  <div class="grid grid-cols-3 gap-4">
    <!-- 左側: プレビューエリア -->
    <div class="col-span-1 min-h-xs">
      <PostActionPreview :action="action" />
    </div>

    <!-- 右側: 設定エリア -->
    <div class="col-span-2 space-y-2">
      <!-- ActionType -->
      <SettingItem label="🚀 アクションタイプ" description="種類を選択します">
        <select
          class="select select-sm w-full max-w-xs"
          :value="action.actionType"
          @change="updateActionType(($event.target as HTMLSelectElement).value as PostActionTypes)"
        >
          <option v-for="t in postActionTypes" :key="t.type" :value="t.type">
            {{ t.label }}
          </option>
        </select>
      </SettingItem>

      <!-- 遅延秒数（全タイプ共通） -->
      <SettingItem label="⏱️ 遅延秒数" description="この秒数後に下記のアクションを実行します">
        <input
          type="number"
          v-model.number="delaySeconds"
          min="-1"
          step="0.1"
          class="input input-bordered input-sm w-32"
          placeholder="0"
        />
      </SettingItem>

      <!-- 動的コンポーネント表示 -->
      <component
        v-if="currentComponent"
        :is="currentComponent"
        v-bind="{ action: action as any, 'character-options': characterOptions }"
        @update:action="handleActionUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PostActionSchema, PostActionType, PostActionTypes, postActionTypes } from '@/types/'
  import MessageSettings from '../Message/MessageSettings.vue'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import WordPartySettings from '../WordParty/WordPartySettings.vue'
  import ActionSetSettings from '../ActionSet/ActionSetSettings.vue'
  import PostActionPreview from '../preview/PostActionPreview.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  // Props
  const props = defineProps<{
    action: PostActionType
    index: number
    characterOptions: Array<{ value: string; label: string }>
  }>()

  // Emits
  const emit = defineEmits<{
    duplicate: [index: number]
    remove: [index: number]
    'update:action': [value: PostActionType]
  }>()

  // 現在表示すべきコンポーネントの決定
  const currentComponent = computed(() => {
    const componentMap: Record<PostActionTypes, any> = {
      message: MessageSettings,
      sound: SoundSettings,
      wordParty: WordPartySettings,
      actionSet: ActionSetSettings,
    }

    return componentMap[props.action.actionType]
  })

  // 遅延秒数のcomputed
  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => emit('update:action', { ...props.action, delaySeconds: value }),
  })

  // actionType 別の生データキャッシュ
  const rawActionCache = ref<Partial<Record<PostActionTypes, any>>>({})

  // アクションタイプの更新
  const updateActionType = (newType: PostActionTypes) => {
    const currentType = props.action.actionType

    // ① 現在の状態を退避
    rawActionCache.value[currentType] = {
      ...rawActionCache.value[currentType],
      ...props.action,
    }

    // ② 復元候補を取得（なければ最低限のベース）
    const restored = rawActionCache.value[newType] ?? {
      ...props.action,
      delaySeconds: props.action.delaySeconds,
      actionType: newType,
      special: 'return',
      actionSetKeys: [''],
    }

    try {
      // ③ Zodで正規化
      const newAction = PostActionSchema.parse({
        ...restored,
        actionType: newType,
      })

      emit('update:action', newAction)
    } catch (error) {
      console.error(`Action type change failed Zod validation for type "${newType}":`, error)
    }
  }

  // アクション更新のハンドラー
  const handleActionUpdate = (updatedAction: PostActionType) => {
    emit('update:action', updatedAction)
  }
</script>
