// types.ts
export interface CommentSet {
  label: string
  comments: string[]
}

export interface CommentSets {
  [key: string]: CommentSet
}

export interface LogEntry {
  name: string
  comment: string
  isNew: boolean
  isBunkei: boolean
}

export interface WanKomePayload {
  platform: string
  comment: string
  username: string
  hasGift: boolean
  speech: boolean
  newComment: boolean
  repeater: boolean
}
