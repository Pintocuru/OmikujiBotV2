// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\types\GameScript\GameScriptBase.ts
import { UserVisitManager } from '@/MainGenerator/stores/UserVisitManager/UserVisitManager'

// store のマネージャ呼び出し
export abstract class GameScriptBase {
  protected visitManager?: UserVisitManager

  // 初期化メソッド(GameScriptManagerから呼ばれる)
  initialize(visitManager?: UserVisitManager) {
    this.visitManager = visitManager
  }
}
