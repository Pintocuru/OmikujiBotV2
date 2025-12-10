<!-- src/ConfigMaker/components/display/EditorSettingsEditor.vue -->
<template>
  <!-- DaisyUIテーマ -->
  <SettingItem label="エディターテーマ" description="DaisyUiのカラーテーマを設定します" forceMode="pro">
    <select
      :value="editor.daisyUiTheme"
      @change="(e) => updateEditorField('daisyUiTheme', (e.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- ライセンスキー -->
  <SettingItem
    v-if="isDev || useVisibilityAccess().canShow('licenseVisible')"
    devMemo="licenseVisible"
    label="ライセンスキー"
    description="入力したハッシュでモードを判定します"
  >
    <div class="flex gap-2 items-center">
      <span v-if="isPro && !isGod" class="badge badge-success">PRO</span>
      <span v-if="isGod" class="badge badge-warning">GOD-MODE</span>
      <input
        type="password"
        class="input input-bordered flex-1"
        :value="licenseKeyHash"
        @input="(e) => updateLicenseKeyHash((e.target as HTMLInputElement).value)"
        placeholder="****"
      />
      <span v-if="isDev">
        <button class="btn btn-sm btn-primary mr-2" @click="updateLicenseKeyHash('')">basic</button>
        <button class="btn btn-sm btn-success mr-2" @click="updateLicenseKeyHash(getKey('pro'))">PRO</button>
        <button class="btn btn-sm btn-warning" @click="updateLicenseKeyHash(getKey('godMode'))">GOD-MODE</button>
      </span>
    </div>
  </SettingItem>

  <!-- 補足説明 -->
  <InformationCard v-if="isPro && !isGod">
    <p>PROライセンスキーを入力したあとは：</p>
    <p>ライセンスは即時適用されますが、保存を行わないと、リロード時にライセンスが戻ってしまいます。</p>
    <p>「設定を出力(js)」を押して、保存するのをお忘れなく。</p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { isDev } from '@/types'
  import { getKey } from '@/types/SettingMode'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import { storeToRefs } from 'pinia'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // v2では editor を参照
  const editor = computed(() => data.value.displaySettings.editor)
  const licenseKeyHash = computed(() => editor.value.licenseKeyHash)

  // DaisyUIテーマ更新
  const updateEditorField = (field: keyof typeof editor.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('editor', {
      ...editor.value,
      [field]: value,
    })
  }

  // ライセンスキー更新
  const updateLicenseKeyHash = (value: string) => {
    omikujiStore.updateNestedDisplaySettings('editor', {
      ...editor.value,
      licenseKeyHash: value,
    })
  }
</script>
