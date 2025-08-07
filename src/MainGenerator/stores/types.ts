// src\MainGenerator\stores\types.ts
import type { useAppStore, useDisplayStore } from '@/MainGenerator/stores/';

export type AppStore = ReturnType<typeof useAppStore>;
export type DisplayStore = ReturnType<typeof useDisplayStore>;
