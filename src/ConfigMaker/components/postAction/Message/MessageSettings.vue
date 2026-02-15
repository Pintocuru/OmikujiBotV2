<!-- src\ConfigMaker\components\postAction\items\MessageSettings.vue -->
<template>
  <!-- キャラクター選択 -->
  <div v-if="isCharacter" class="space-y-2">
    <SettingItem label="👤キャラクター・カラー" description="フキダシの色や読み上げのキャラクターを選択">
      <select v-model="characterKey" class="select select-bordered select-sm w-full max-w-xs">
        <option v-for="(value, key) in characterMap" :key="key" :value="key">
          {{ value.name }}
        </option>
      </select>
    </SettingItem>

    <!-- アイコン選択 -->
    <SettingItem v-if="characterKey && characterKey !== ''" label="🎨 アイコン" description="表示する画像を選択">
      <IconSelector :character-key="characterKey" :icon-key="action.iconKey" @update:icon-key="updateIconKey" />
    </SettingItem>
  </div>

  <!-- 表示形式の選択（単一） -->
  <SettingItem label="表示形式" description="フキダシかトーストを選択してください">
    <label class="mr-4">
      <input type="radio" :value="false" :checked="!isToast" @change="handleTypeChange" />
      💬 フキダシ
    </label>
    <label>
      <input type="radio" :value="true" :checked="isToast" @change="handleTypeChange" />
      📝 トースト
    </label>
  </SettingItem>

  <!-- 単一の入力欄：isToast に応じてラベル／説明／プレースホルダを切替 -->
  <SettingItem :label="isToast ? '📝 トースト内容' : '💬 フキダシ内容'" description="プレースホルダーが使えます">
    <div class="relative w-full">
      <!-- input -->
      <input
        v-model="bubbleText"
        type="text"
        class="input input-bordered input-sm w-full pr-10"
        :placeholder="isToast ? 'トーストのメッセージを入力' : 'フキダシのメッセージを入力'"
        :class="{ hidden: isTextarea }"
      />

      <!-- textarea -->
      <textarea
        v-model="bubbleText"
        rows="3"
        class="textarea textarea-bordered textarea-sm w-full pr-10"
        :placeholder="isToast ? 'トーストのメッセージを入力' : 'フキダシのメッセージを入力'"
        :class="{ hidden: !isTextarea }"
      ></textarea>

      <!-- 切り替えボタン -->
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
        @click="isTextarea = !isTextarea"
      >
        <AlignLeft v-if="!isTextarea" class="w-4 h-4" />
        <AlignJustify v-else class="w-4 h-4" />
      </button>
    </div>
  </SettingItem>

  <!-- 変数プレースホルダーチェッカー -->
  <VariableDeclarationChecker :text="bubbleText" />

  <!-- プレースホルダーチェッカー -->
  <PlaceholderChecker :text="bubbleText" />

  <!-- サウンド -->
  <SettingItem label="🔊 サウンド" description="フキダシ表示時に鳴らす音">
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">（なし）</option>
      <option v-for="s in soundList" :key="s" :value="s">
        {{ s }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CharacterEmotionType, PostActionMessageType } from '@/types/'
  import IconSelector from '@config/components/postAction/IconSelector/IconSelector.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import VariableDeclarationChecker from '../items/VariableDeclarationChecker.vue'
  import PlaceholderChecker from '../items/PlaceholderChecker.vue'
  import { soundList } from '@sounds/soundMap'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { AlignLeft, AlignJustify } from 'lucide-vue-next'
  import { useCharacterManager } from '@/ConfigMaker/scripts/CharacterManager/useCharacterManager'

  const props = defineProps<{
    action: PostActionMessageType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostActionMessageType]
  }>()

  // キャラクターオプションの取得
  const { isCharacter } = useVisibilityAccess()
  const { characterMap } = useCharacterManager()

  const isTextarea = ref(true)

  const updateAction = (updates: Partial<PostActionMessageType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const characterKey = computed({
    get: () => props.action.characterKey,
    set: (value) => updateAction({ characterKey: value }),
  })

  // isToast フラグの computed
  const isToast = computed<boolean>({
    get: () => props.action.message.isToast,
    set: (value) => {
      updateAction({
        message: {
          ...props.action.message,
          isToast: value,
        },
      })
    },
  })

  // bubble フィールドの computed（メッセージ内容）
  const bubbleText = computed<string>({
    get: () => props.action.message.bubble ?? '',
    set: (value) => {
      updateAction({
        message: {
          ...props.action.message,
          bubble: value,
        },
      })
    },
  })

  // ラジオ切替：isToast を更新
  const handleTypeChange = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value === 'true'
    isToast.value = newValue
  }

  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined }),
  })

  const updateIconKey = (value: string) => {
    updateAction({ iconKey: value as CharacterEmotionType })
  }
</script>
