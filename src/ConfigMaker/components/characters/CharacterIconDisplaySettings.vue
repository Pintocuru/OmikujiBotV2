<!-- src/configMaker/components/characters/CharacterIconDisplaySettings.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>キャラクター表示設定</div>
      <div class="text-sm pr-2">キャラクターアイコン(画像)に関する編集を行います。</div>
    </template>

    <template #body>
      <!-- isIconDisplay  -->
      <SettingItem
        label="キャラクター表示"
        description="ONで画像とフキダシを表示、OFFでフキダシのみ表示"
        :showReset="false"
        containerClass="form-control flex-row items-center gap-2 mt-2"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox checkbox-primary" v-model="localData.isIconDisplay" />
          <span class="label-text font-medium">有効にするとアイコン画像の設定が可能になります</span>
        </label>
      </SettingItem>

      <!-- isOneCommePost -->
      <SettingItem
        label="BOTコメントをわんコメに投稿"
        description="わんコメにBOTコメントとして表示させるか"
        :showReset="false"
        containerClass="form-control flex-row items-center gap-2 mt-2"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox checkbox-primary" v-model="localData.isOneCommePost" />
          <span class="label-text font-medium">有効にすると「キャラクター用枠設定」の設定ができます</span>
        </label>
      </SettingItem>

      <!-- isVoice  -->
      <SettingItem
        v-if="!localData.isOneCommePost"
        label="BOTコメントの読み上げ"
        description="BOTコメントをわんコメで鳴らすか"
        :showReset="false"
        containerClass="form-control flex-row items-center gap-2 mt-2"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox checkbox-primary" v-model="localData.isVoice" />
          <span class="label-text font-medium">読み上げの声は「わんコメの標準設定」が使われます</span>
        </label>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DisplayOptionType } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'

  const props = defineProps<{
    modelValue: DisplayOptionType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: DisplayOptionType]
  }>()

  // v-modelを使用したlocalColorの実装
  const localData = computed({
    get: () => props.modelValue,
    set: (value: DisplayOptionType) => {
      emit('update:modelValue', value)
    },
  })
</script>
