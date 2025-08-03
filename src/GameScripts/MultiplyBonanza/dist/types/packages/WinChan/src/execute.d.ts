import { GameSettings, GameParams, GamePlaceholder, GameStatePlus } from './params';
import { ScriptResult, ScriptClass } from '@public/types/PresetTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
export declare class WinChanScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder, GameStatePlus> {
    private static readonly DEFAULT_USER_NAME;
    private static readonly WIN_RATE_MULTIPLIER;
    private settings;
    private gameState;
    setup(settings: GameSettings): void;
    run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder>;
    private updateUserStats;
    private generateRankings;
    private generatePointRankings;
    private generateTotalRankings;
    private getSortKey;
    private prioritizeCurrentUser;
    private calculatePlaceholders;
}
declare const execute: WinChanScript;
export default execute;
//# sourceMappingURL=execute.d.ts.map