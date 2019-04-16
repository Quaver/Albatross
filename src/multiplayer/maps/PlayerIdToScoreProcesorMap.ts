import ScoreProcessor from "../../processors/ScoreProcessor";
import ScoreProcessorKeys from "../../processors/ScoreProcessorKeys";

export default interface PlayerIdToScoreProccessorMap {
    [id: number]: ScoreProcessorKeys
}