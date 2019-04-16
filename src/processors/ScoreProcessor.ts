import JudgementToNumberMap from "./JudgementToNumberMap";
import ModIdentifiers from "../enums/ModIdentifiers";
import ModHelper from "../utils/ModHelper";
import Judgement from "../enums/Judgement";

export default abstract class ScoreProcessor {
    /**
     * The modifiers used on the play
     */
    public Mods: ModIdentifiers = 0;

    /**
     * The total score the player has
     */
    public Score: number = 0;

    /**
     * The overall accuracy the player has
     */
    public Accuracy: number = 0;

    /**
     * The current health the player has
     */
    public Health: number = 100;

    /**
     * The user's current combo
     */
    public Combo: number = 0;

    /**
     * The maximum combo the user has achieved
     */
    public MaxCombo: number = 0;

    /**
     * The current judgements that the user has
     */
    public CurrentJudgements: JudgementToNumberMap = {};
    
    /**
     * The judgement windows for the score processor
     */
    public abstract JudgementWindows: JudgementToNumberMap;

    /**
     * The weighting for score
     */
    public abstract JudgementScoreWeighting: JudgementToNumberMap;

    /**
     * The weighting for health
     */
    public abstract JudgementHealthWeighting: JudgementToNumberMap;

    /**
     * The weighting for accuracy
     */
    public abstract JudgementAccuracyWeighting: JudgementToNumberMap;

    /**
     * The list of judgements in order
     */
    public JudgementList: Judgement[] = [];

    /**
     */
    constructor(mods: ModIdentifiers) {
        this.Mods = mods;
        this.InitializeCurrentJudgements();
        this.InitializeMods();
    }

    /**
     * Returns if the user is currently failed in the play
     * @constructor
     */
    public IsFailed(): boolean {
        return this.Health <= 0;
    }

        /**
     * Returns the total amount of judgements the user has gotten
     */
    public GetTotalJudgementCount(): number {
        let sum: number = 0;

        for (let j in this.CurrentJudgements)
            sum += this.CurrentJudgements[j];

        return sum;
    }

    /**
     * Returns if the place is a full combo
     */
    public IsFullCombo(): boolean {
        return this.MaxCombo == this.GetTotalJudgementCount();
    }

    /**
     * Initializes all currnent judgemts to 0.
     */
    private InitializeCurrentJudgements(): void {
        this.CurrentJudgements[Judgement.Marvelous] = 0;
        this.CurrentJudgements[Judgement.Perfect] = 0;
        this.CurrentJudgements[Judgement.Great] = 0;
        this.CurrentJudgements[Judgement.Good] = 0;
        this.CurrentJudgements[Judgement.Okay] = 0;
        this.CurrentJudgements[Judgement.Miss] = 0;
    }

    /**
     * Initializes any mods for this given play that have to do with scoring
     */
    private InitializeMods(): void {
        for (let j in this.JudgementWindows) 
            this.JudgementWindows[j] *= ModHelper.GetRateFromMods(this.Mods);
    }

    /**
     * Does all score calculations from a received judgement
     * @param judgement 
     */
    public abstract CalculateScore(judgement: Judgement): void;

    /**
     * Calculates accuracy based on the current play session
     */
    public abstract CalculateAccuracy(): number;
}