<!-- src/PresetManager/components/FileMenuDropdown.vue -->
<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-xs">
      <Menu class="w-3 h-3" />
    </label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44">
      <!-- フォルダへ移動（isDev のみ） -->
      <li v-if="showMove">
        <details>
          <summary class="text-sm">
            <FolderInput class="w-4 h-4" />
            移動
          </summary>
          <ul>
            <!-- ルートへ移動 -->
            <li v-if="currentFolder !== null">
              <button class="text-sm" @click="$emit('move', '')">
                <Folder class="w-4 h-4" />
                ルート
              </button>
            </li>
            <!-- 既存フォルダ -->
            <li v-for="folder in folders" :key="folder">
              <button v-if="folder !== currentFolder" class="text-sm" @click="$emit('move', folder)">
                <Folder class="w-4 h-4" />
                {{ folder }}
              </button>
            </li>

            <!-- 新規フォルダ作成 -->
            <li>
              <div>
                <button class="text-sm text-success" @click.stop="isCreatingFolder = true">
                  <FolderPlus class="w-4 h-4" />
                  新規フォルダ
                </button>
                <input
                  ref="newFolderInputRef"
                  v-model="newFolderName"
                  class="input input-xs flex-1 min-w-0"
                  placeholder="フォルダ名"
                  @keydown.enter="confirmNewFolder"
                  @keydown.escape="cancelNewFolder"
                />
                <button class="btn btn-xs btn-success" @click="confirmNewFolder">
                  <Check class="w-3 h-3" />
                </button>
              </div>
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
  import { ref, nextTick, watch } from 'vue'
  import { Menu, Copy, Trash2, Folder, FolderInput, FolderPlus, Check } from 'lucide-vue-next'

  const props = defineProps<{
    folders: string[]
    currentFolder: string | null
    showMove?: boolean
    disableDelete?: boolean
  }>()

  const emit = defineEmits<{
    move: [folder: string]
    duplicate: []
    delete: []
  }>()

  const isCreatingFolder = ref(false)
  const newFolderName = ref('')
  const newFolderInputRef = ref<HTMLInputElement>()

  watch(isCreatingFolder, (val) => {
    if (val) nextTick(() => newFolderInputRef.value?.focus())
  })

  const confirmNewFolder = () => {
    const name = newFolderName.value.trim()
    // 英数字・ハイフン・アンダースコアのみ（サーバー側バリデーションと合わせる）
    if (name && /^[\w\-]+$/.test(name) && name !== props.currentFolder) {
      emit('move', name)
    }
    cancelNewFolder()
  }

  const cancelNewFolder = () => {
    isCreatingFolder.value = false
    newFolderName.value = ''
  }
</script>
