// src/GameScripts/GoogolClover/game.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { SlotGame } from './game'
import type { UserState } from './types'

describe('SlotGame', () => {
  let game: SlotGame
  let userStates: Map<string, UserState>

  beforeEach(() => {
    game = new SlotGame()
    userStates = new Map()
  })

  describe('基本動作テスト', () => {
    it('エラーなく実行できる', () => {
      expect(() => {
        game.playSlot(userStates, 'test-user-1')
      }).not.toThrow()
    })

    it('初回プレイで結果が返される', () => {
      const result = game.playSlot(userStates, 'test-user-1')

      expect(result).toBeDefined()
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('symbol')
      expect(result).toHaveProperty('payout')
      expect(result).toHaveProperty('party')
    })

    it('結果のメッセージが文字列である', () => {
      const result = game.playSlot(userStates, 'test-user-1')
      expect(typeof result.message).toBe('string')
    })

    it('結果のシンボルが文字列である', () => {
      const result = game.playSlot(userStates, 'test-user-1')
      expect(typeof result.symbol).toBe('string')
    })

    it('結果のpayoutが数値である', () => {
      const result = game.playSlot(userStates, 'test-user-1')
      expect(typeof result.payout).toBe('number')
    })

    it('結果のpartyが指定された値のいずれかである', () => {
      const result = game.playSlot(userStates, 'test-user-1')
      expect(['!bombFail', '!bombWin', '!bombSuccess']).toContain(result.party)
    })

    it('複数回連続で実行できる', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          game.playSlot(userStates, `test-user-${i}`)
        }
      }).not.toThrow()
    })

    it('同じユーザーで複数回プレイできる', () => {
      const userId = 'test-user-same'

      expect(() => {
        for (let i = 0; i < 5; i++) {
          game.playSlot(userStates, userId)
        }
      }).not.toThrow()
    })
  })

  describe('状態管理テスト', () => {
    it('成功時は状態が保存される', () => {
      const userId = 'test-user-state'
      const result = game.playSlot(userStates, userId)

      if (result.party === '!bombSuccess') {
        expect(userStates.has(userId)).toBe(true)
      }
    })

    it('失敗時は状態が削除される', () => {
      const userId = 'test-user-fail'
      const result = game.playSlot(userStates, userId)

      if (result.party === '!bombFail') {
        expect(userStates.has(userId)).toBe(false)
      }
    })

    it('クリア時は状態が削除される', () => {
      const userId = 'test-user-clear'
      const result = game.playSlot(userStates, userId)

      if (result.party === '!bombWin') {
        expect(userStates.has(userId)).toBe(false)
      }
    })
  })

  describe('100回プレイテスト', () => {
    it('100回プレイしてクリア回数を記録', () => {
      const results = {
        clear: 0,
        fail: 0,
        success: 0,
        totalPlays: 0,
      }

      for (let i = 0; i < 100; i++) {
        const userId = `test-user-${i}`
        const localUserStates = new Map<string, UserState>()
        let playCount = 0

        // 各ユーザーが失敗またはクリアするまでプレイ
        while (true) {
          const result = game.playSlot(localUserStates, userId)
          playCount++
          results.totalPlays++

          if (result.party === '!bombWin') {
            console.log(playCount, result.message)
            results.clear++
            break
          } else if (result.party === '!bombFail') {
            results.fail++
            break
          } else {
            results.success++
          }

          // 無限ループ防止（最大10000回プレイ）
          if (playCount > 10000) {
            results.fail++
            break
          }
        }
      }

      console.log('=== 100回プレイ統計 ===')
      console.log(`クリア回数: ${results.clear}`)
      console.log(`失敗回数: ${results.fail}`)
      console.log(`成功継続: ${results.success}`)
      console.log(`総プレイ数: ${results.totalPlays}`)
      console.log(`クリア率: ${((results.clear / 100) * 100).toFixed(2)}%`)

      // 少なくとも100回のゲームが完了していることを確認
      expect(results.clear + results.fail).toBe(100)

      // クリアまたは失敗が発生していることを確認
      expect(results.clear + results.fail).toBeGreaterThan(0)
    })
  })
})
