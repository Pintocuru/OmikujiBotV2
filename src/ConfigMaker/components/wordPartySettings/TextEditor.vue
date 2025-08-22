<!-- src/configMaker/components/wordPartySettings/TextEditor.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>リストのテキスト編集</div>
    </template>

    <template #body>
      <!-- 補足説明 -->
      <InformationCard>
        <p>
          <code class="label bg-accent text-accent-content"> WordPartyリスト </code>は、任意のWordParty
          テンプレートを発動させるためのリストです。
        </p>
        <p>
          予めこのリストに記載しておくと、<code class="label bg-accent text-accent-content"
            >おみくじ設定 > 詳細設定 > Post Actions 編集</code
          >
          から
        </p>
        <p>このリストに記載された内容を選択することができます。</p>
        <p class="pt-2">
          初期設定では、
          <a
            href="https://booth.pm/ja/items/6048048"
            target="_blank"
            rel="noopener"
            class="inline-block px-2 py-1 rounded bg-secondary text-secondary-content hover:bg-secondary/70 transition"
          >
            おみくじBOT用 word-party
          </a>
          のデータが入っています。
        </p>
      </InformationCard>

      <!-- テキストエディタ（直接表示） -->
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="textarea textarea-bordered w-full h-96 font-mono text-sm"
        placeholder="効果音:ドアチャイム1,^!ドアチャイム1&#10;効果音:レベルアップ,^!レベルアップ&#10;効果音:シャキーン2,^!シャキーン2"
      ></textarea>

      <!-- 保存ボタン -->
      <ModalFooterActions :on-cancel="() => $emit('reset')" :on-save="() => $emit('save')" saveName="💾 保存" />
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'

  defineProps<{
    modelValue: string
    settings: WordPartySettings[]
  }>()

  defineEmits<{
    'update:modelValue': [value: string]
    save: []
    reset: []
  }>()
</script>
