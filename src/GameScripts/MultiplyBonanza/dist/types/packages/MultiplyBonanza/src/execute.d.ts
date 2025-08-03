import { GameSettings, GameParams, GamePlaceholder } from './params';
import { ScriptResult, ScriptClass } from '@public/types/PresetTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameStateExtras } from '../../WinChan/src/params';
export declare class ExecuteScript implements ScriptClass<GameSettings, GameParams, GamePlaceholder, GameStateExtras> {
    private settings;
    private winChan;
    setup(settings: GameSettings): void;
    run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder>;
    private playGame;
    private calculateBoost;
    private generateReels;
    private selectSymbolByWeight;
    private calculateResult;
    private calculateWays;
    private calculatePayout;
    private generateSymbolDisplay;
    private createEmptyResult;
    private createMessage;
    private getWinMessage;
}
declare const execute: ExecuteScript;
export default execute;
//# sourceMappingURL=execute.d.ts.map