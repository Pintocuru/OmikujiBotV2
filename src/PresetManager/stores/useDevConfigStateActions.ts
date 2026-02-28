// src/PresetManager/stores/useDevConfigStateActions.ts
import { FileItem, DevConfigStateType } from '../devTypes'

export function useDevConfigStateActions(state: DevConfigStateType) {
  // ファイル管理
  const setFiles = (files: FileItem[]) => {
    state.availableFiles.value = files
  }

  const addFile = (file: FileItem) => {
    const existingIndex = state.availableFiles.value.findIndex((f: FileItem) => f.name === file.name)
    if (existingIndex >= 0) {
      state.availableFiles.value[existingIndex] = file
    } else {
      state.availableFiles.value.push(file)
    }
  }

  const removeFile = (fileName: string) => {
    const index = state.availableFiles.value.findIndex((f: FileItem) => f.name === fileName)
    if (index >= 0) {
      state.availableFiles.value.splice(index, 1)
    }
  }

  const updateFileNameInState = (oldName: string, newName: string) => {
    const file = state.availableFiles.value.find((f: FileItem) => f.name === oldName)
    if (file) {
      file.name = newName
    }
  }

  return {
    setFiles,
    addFile,
    removeFile,
    updateFileNameInState,
  }
}
