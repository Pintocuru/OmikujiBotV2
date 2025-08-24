// src\ConfigMaker\components\parts\ItemVariantTypes.ts

export type BaseVariant = 'none' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

export type OutlineVariant =
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-info'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-error'

export type VariantType = BaseVariant | OutlineVariant
