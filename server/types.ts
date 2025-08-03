// server/types.ts
export interface FileItem {
 name: string;
 modified: string;
}

export interface SaveRequest {
 fileName: string;
 data: string;
}

export interface SaveOmikujiRequest {
 configData: any;
}
