<!-- src/ConfigMaker/components/postAction/items/PostActionItem.vue -->
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
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(meta, type) in PostFlowKindMaps"
            :key="type"
            class="badge badge-sm cursor-pointer"
            :class="action.actionType === type ? 'badge-primary' : 'badge-outline'"
            @click="updateActionType(type)"
          >
            {{ meta.label }}
          </span>
        </div>
      </SettingItem>

      <!-- 遅延秒数（全タイプ共通） -->
      <SettingItem label="⏱️ 遅延秒数" description="この秒数後に下記のアクションを実行します">
        <input
          type="number"
          v-model.number="delaySeconds"
          :min="basicDelaySeconds * -1"
          step="0.1"
          class="input input-bordered input-sm w-32"
          placeholder="0"
        />
      </SettingItem>

      <!-- 動的コンポーネント表示 -->
      <component
        v-if="currentComponent"
        :is="currentComponent"
        v-bind="{ action: action as any }"
        @update:action="handleActionUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PostFlowSchema, PostFlowType, PostFlowKind, PostFlowKindMaps } from '@/types'
  import MessageSettings from '../Message/MessageSettings.vue'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import WordPartySettings from '../WordParty/WordPartySettings.vue'
  import VariableSettings from '../variable/VariableSettings.vue'
  import ActionSetSettings from '../ActionSet/ActionSetSettings.vue'
  import PostActionPreview from '../preview/PostActionPreview.vue'
  import BotSettings from '../Bot/BotSettings.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  // Props
  const props = defineProps<{
    action: PostFlowType
    index: number
  }>()

  // Emits
  const emit = defineEmits<{
    duplicate: [index: number]
    remove: [index: number]
    'update:action': [value: PostFlowType]
  }>()

  const omikujiStore = useOmikujiStore()
  const basicDelaySeconds = computed(() => omikujiStore.data.settings.basicDelaySeconds ?? 1)

  // 現在表示すべきコンポーネントの決定
  const currentComponent = computed(() => {
    const componentMap: Record<PostFlowKind, any> = {
      message: MessageSettings,
      sound: SoundSettings,
      wordParty: WordPartySettings,
      variable: VariableSettings,
      bot: BotSettings,
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
  const rawActionCache = ref<Partial<Record<PostFlowKind, any>>>({})

  // アクションタイプの更新
  const updateActionType = (newType: PostFlowKind) => {
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
      actionSetKeys: [''],
    }

    try {
      // ③ Zodで正規化
      const newAction = PostFlowSchema.parse({
        ...restored,
        actionType: newType,
      })

      emit('update:action', newAction)
    } catch (error) {
      console.error(`Action type change failed Zod validation for type "${newType}":`, error)
    }
  }

  // アクション更新のハンドラー
  const handleActionUpdate = (updatedAction: PostFlowType) => {
    emit('update:action', updatedAction)
  }
</script>
