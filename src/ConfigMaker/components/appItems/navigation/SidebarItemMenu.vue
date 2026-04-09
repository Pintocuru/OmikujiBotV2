<!-- src/ConfigMaker/components/appItems/navigation/SidebarItemMenu.vue -->
<template>
  <div class="dropdown dropdown-end" @click.stop>
    <button tabindex="0" class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreHorizontal class="w-3 h-3" />
    </button>

    <ul
      tabindex="0"
      class="dropdown-content menu z-50 w-32 rounded-md border border-base-300 bg-base-200 text-base-content shadow-lg p-1"
    >
      <!-- 有効/無効 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleToggle">
          <component :is="item.isEnabled === false ? Eye : EyeOff" class="w-3 h-3" />
          {{ item.isEnabled === false ? '有効にする' : '無効にする' }}
        </button>
      </li>

      <!-- 複製 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleDuplicate">
          <Copy class="w-3 h-3" />
          複製
        </button>
      </li>

      <!-- JSONコピー -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleCopyJson">
          <ClipboardCopy class="w-3 h-3" />
          JSONコピー
        </button>
      </li>

      <!-- JSON貼り付け -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handlePasteJson">
          <ClipboardPaste class="w-3 h-3" />
          JSON貼り付け
        </button>
      </li>

      <li class="menu-title p-0"><hr class="border-base-300" /></li>

      <!-- 削除 -->
      <li>
        <button
          class="flex items-center gap-2 text-xs text-error hover:bg-error hover:text-error-content"
          @click="handleDelete"
        >
          <Trash2 class="w-3 h-3" />
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { Eye, EyeOff, Copy, Trash2, MoreHorizontal, ClipboardCopy, ClipboardPaste } from 'lucide-vue-next'
  import { RecordCategoryType, RecordCategorySchemaMap, eventCategoryLabel } from '@/types/OmikujiData/'
  import { BaseRecordType } from '@shared/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  const props = defineProps<{
    item: BaseRecordType
    category: RecordCategoryType
  }>()

  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()

  // フォーカスを外してdropdownを閉じる
  const close = () => {
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const handleToggle = () => {
    omikujiStore.updateItem(props.category, props.item.key, {
      ...props.item,
      isEnabled: !Boolean(props.item.isEnabled),
    })
    swalToast.success({ title: '有効・無効をを更新しました' })
    close()
  }

  const handleDuplicate = () => {
    omikujiStore.duplicateItem(props.category, props.item.key)
    swalToast.success({ title: 'イベントを複製しました' })
    close()
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(props.item, null, 2))
      swalToast.success({ title: 'JSONをクリップボードにコピーしました' })
    } catch {
      swalToast.error({ title: 'コピーに失敗しました' })
    }
    close()
  }

  const handlePasteJson = async () => {
    close()

    let text: string
    try {
      text = await navigator.clipboard.readText()
    } catch {
      swalToast.error({ title: 'クリップボードの読み取りに失敗しました' })
      return
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(text)
    } catch {
      swalToast.error({ title: 'クリップボードの内容が正しいJSON形式ではありません' })
      return
    }

    // ソースカテゴリを推定（ruleType フィールドがあれば優先、なければ貼り付け先と同一とみなす）
    const sourceCategory = (parsed.ruleType as RecordCategoryType | undefined) ?? props.category

    // カテゴリ互換性チェック
    const isEventCategory = (c: string) => (eventCategoryLabel as readonly string[]).includes(c)
    const isSameCategory = sourceCategory === props.category
    const isCrossEvent = !isSameCategory && isEventCategory(sourceCategory) && isEventCategory(props.category)
    const isIncompatible = !isSameCategory && !isCrossEvent

    if (isIncompatible) {
      swalToast.error({
        title: 'カテゴリが異なるため貼り付けできません',
        text: `コピー元: ${sourceCategory} → 貼り付け先: ${props.category}`,
      })
      return
    }

    if (isCrossEvent) {
      const result = await swalModal.confirmDelete({
        title: 'カテゴリが異なります',
        text: `「${sourceCategory}」のデータを「${props.category}」として貼り付けます。\nトリガーなど一部の設定はリセットされますが、おみくじ設定は引き継がれます。よろしいですか？`,
        icon: 'warning',
        confirmButtonText: '貼り付け',
      })
      if (!result.isConfirmed) return
    }

    try {
      const schema = RecordCategorySchemaMap[props.category]
      const { id: _id, key: _key, ruleType: _ruleType, ...rest } = parsed
      const validated = schema.parse(rest)
      omikujiStore.addItem(props.category, validated)
      swalToast.success({
        title: isCrossEvent ? `「${sourceCategory}」から変換して貼り付けました` : 'JSONを貼り付けました',
      })
    } catch {
      swalToast.error({ title: 'データの検証に失敗しました' })
    }
  }

  const handleDelete = async () => {
    close()
    const name = props.item.name || '名前未設定'
    const result = await swalModal.confirmDelete({
      title: `「${name}」を削除しますか？`,
    })
    if (!result.isConfirmed) return

    navigationStore.selectNextItem()
    omikujiStore.removeItem(props.category, props.item.key)
    swalToast.success({ title: `「${name}」を削除しました` })
  }
</script>
