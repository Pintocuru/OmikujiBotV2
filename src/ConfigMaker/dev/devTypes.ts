// src/configMaker/dev/devTypes.ts

export interface FileItem {
 name: string;
 displayName: string;
 modified: string;
}

export interface DevConfigsState {
 // ファイル関連
 saveFileName: string;
 availableFiles: FileItem[];

 // ローディング状態
 isSaving: boolean;
 isLoading: boolean;
 isDeleting: boolean;
 isLoadingFileList: boolean;
 isExecutingConfirm: boolean;

 // 接続状態
 isServerConnected: boolean;

 // 個別のファイル削除状態を管理
 isDeletingFileMap: Map<string, boolean>;
}
