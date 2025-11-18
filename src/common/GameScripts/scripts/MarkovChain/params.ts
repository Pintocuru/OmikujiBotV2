// src/params.ts
import { z } from 'zod'
import { ScriptPlaceholderItem, ParameterItem, PostActionWordPartyType } from '@/types/'

/**
 * settings
 */
export const BotSettingsSchema = z.object({
  maxRetries: z.number().int().min(1).max(10).default(3).catch(3),
  minLength: z.number().int().min(30).max(150).default(50).catch(50),
})
export type BotSettings = z.infer<typeof BotSettingsSchema>

export const settings: ParameterItem<BotSettings>[] = [
  {
    key: 'maxRetries',
    name: '生成リトライ回数',
    description: '目標文字数に達しない場合の再試行回数',
    inputType: 'number',
    defaultValue: 3,
    min: 1,
    max: 10,
  },
  {
    key: 'minLength',
    name: '最小文字数',
    description: '生成するテキストの最小文字数',
    inputType: 'number',
    defaultValue: 50,
    min: 50,
    max: 200,
  },
]

/**
 * params
 */
export const responseStyles = ['友好的', '丁寧', 'カジュアル', '元気'] as const
export const BotParamsSchema = z.object({
  responseStyle: z.enum(responseStyles).default('友好的').catch('友好的'),
})
export type BotParams = z.infer<typeof BotParamsSchema>

export const params: ParameterItem<BotParams>[] = [
  {
    key: 'responseStyle',
    name: '応答スタイル',
    description: 'BOTの応答スタイルを選択します',
    inputType: 'select',
    values: ['友好的', '丁寧', 'カジュアル', '元気'],
    defaultValue: '友好的',
  },
]

/**
 * postActions
 */
export const postActions: PostActionWordPartyType[] = []

/**
 * placeholders
 */
export type BotPlaceholder = {
  message: string
  userName: string
  responseStyle: string
  textLength: number
}

export const placeholders: ScriptPlaceholderItem<BotPlaceholder>[] = [
  {
    key: 'message',
    name: 'BOT応答メッセージ',
    description: 'マルコフ連鎖で生成された150文字程度の応答テキスト',
    value: 'こんにちは!今日はとても良い天気ですね。配信を見ていただきありがとうございます!',
  },
  {
    key: 'userName',
    name: 'ユーザー名',
    description: 'コメントしたユーザーの表示名',
    value: 'ゲスト',
  },
  {
    key: 'responseStyle',
    name: '応答スタイル',
    description: '使用された応答スタイル',
    value: '友好的',
  },
  {
    key: 'textLength',
    name: 'テキスト文字数',
    description: '生成されたテキストの文字数',
    value: '150',
  },
]
