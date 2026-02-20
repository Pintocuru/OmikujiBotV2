<!-- src/ConfigMaker/components/characters/CharacterImage/ImageSettingsInfo.vue -->
<template>
  <InformationCard>
    <p>
      画像ファイルは事前に
      <code class="label bg-accent text-accent-content"> Characters/[キャラクターID] </code>
      フォルダ内に配置してください。(例:Characters/reimu/default.webp)
    </p>
    <p>
      ファイル名は固定で、例：
      <code class="label bg-accent text-accent-content">default.png</code>、
      <code class="label bg-accent text-accent-content">happy.png</code>、
      <code class="label bg-accent text-accent-content">laughing.png</code>
      など12種類です（png/jpg/jpeg/gif/webp対応）。
    </p>
    <p>
      各項目の
      <button class="btn btn-ghost btn-xs px-1 py-0 h-auto min-h-0 text-xs" title="クリックでデフォルトパスを設定">
        <RotateCcw class="w-3 h-3 mr-1" />
        リセット
      </button>
      ボタンをクリックすると、
      <code class="label bg-accent text-accent-content"> [キャラクターID]/[感情名].png, gif, webp...</code>
      といった画像の拡張子が順に切り替わります。目的の拡張子になるまでクリックしてください。
    </p>
    <p class="mt-2 text-sm">
      <strong>レイヤー機能:</strong> 各感情に複数の画像を設定できます。
      上のレイヤーほど手前に表示されます（配列の0番が最前面）。
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { RotateCcw } from 'lucide-vue-next'
</script>
