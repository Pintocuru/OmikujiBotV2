<!-- src/ConfigMaker/dev/components/FileMenuDropdown.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-xs">
      <Menu class="w-3 h-3" />
    </label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
      <!-- フォルダへ移動 -->
      <li v-if="folders.length > 0">
        <details>
          <summary class="text-sm">
            <FolderInput class="w-4 h-4" />
            移動
          </summary>
          <ul>
            <!-- ルートへ移動（現在ルートなら非表示） -->
            <li v-if="currentFolder !== null">
              <button class="text-sm" @click="$emit('move', '')">
                <Folder class="w-4 h-4" />
                ルート
              </button>
            </li>
            <!-- 各フォルダへ移動（現在のフォルダは非表示） -->
            <li v-for="folder in folders" :key="folder">
              <button v-if="folder !== currentFolder" class="text-sm" @click="$emit('move', folder)">
                <Folder class="w-4 h-4" />
                {{ folder }}
              </button>
            </li>
          </ul>
        </details>
      </li>

      <li>
        <button class="text-sm" @click="$emit('duplicate')">
          <Copy class="w-4 h-4" />
          複製
        </button>
      </li>
      <li>
        <button class="text-sm text-error" :disabled="disableDelete" @click="$emit('delete')">
          <Trash2 class="w-4 h-4" />
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { Menu, Copy, Trash2, Folder, FolderInput } from 'lucide-vue-next'

  defineProps<{
    folders: string[] // 移動先の候補フォルダ一覧
    currentFolder: string | null // 現在のフォルダ（自分自身を除外するため）
    disableDelete?: boolean
  }>()

  defineEmits<{
    move: [folder: string] // '' はルートを意味する
    duplicate: []
    delete: []
  }>()
</script>
