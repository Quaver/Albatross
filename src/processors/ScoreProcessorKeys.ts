import ScoreProcessor from "./ScoreProcessor";
import ModIdentifiers from "../enums/ModIdentifiers";
import JudgementToNumberMap from "./JudgementToNumberMap";
import Judgement from "../enums/Judgement";
import ScoreProcessorMultiplayer from "./ScoreProcessorMultiplayer";
import ScoreProcessorHitStat from "./ScoreProcessorHitStat";

export default class ScoreProcessorKeys extends ScoreProcessor {
    /**
     * The judgement windows for the score processor
     */
    public JudgementWindows: JudgementToNumberMap = {};

    /**
     * The value the judgement windows increase by for long note releases
     */
    public WindowReleaseMultiplier: number = 1.5;

    /**
     * The weighting for score
     */
    public JudgementScoreWeighting: JudgementToNumberMap = {};

    /**
     * The weighting for health
     */
    public JudgementHealthWeighting: JudgementToNumberMap = {};

    /**
     * The weighting for accuracy
     */
    public JudgementAccuracyWeighting: JudgementToNumberMap = {};

    /**
     * See: ScoreProcessorKeys.CalculateSummedScore();
     */
    private SummedScore: number = 0;

    /**
     * Counts consecutive hits for the score multiplier
     * Max Multiplier Count is MultiplierMaxIndex * MultiplierCountToIncreaseIndex
     */
    private MultiplierCount: number = 0;

    /**
     * After 10 hits, the multiplier index will increase.
     */
    private MultiplierIndex: number = 0;

    /**
     * Max Index for multiplier. Multiplier index can not increase more than this value.
     */
    private MultiplierMaxIndex: number = 15;

    /**
     * Multiplier Count needed in order to increase the Multiplier Index by 1.
     * By increasing this multiplier index, notes will be worth more score.
     */
    private MultiplierCountToIncreaseIndex: number = 10;

    /**
     * Total actual score. (Regular Score is ScoreCount / SummedScore)
     */
    private ScoreCount: number = 0;

    /**
     * The player's performance rating for the score
     */
    public PerformanceRating: number = 0;

    /**
     * The difficulty rating of the map
     */
    private DifficultyRating: number;

    /**
     */
    constructor(mods: ModIdentifiers, multiplayer: ScoreProcessorMultiplayer | undefined = undefined, difficultyRating: number = 0.00) {
        super(mods, multiplayer);

        this.DifficultyRating = difficultyRating;
        this.InitializeJudgementWindows();
        this.InitializeScoreWeightingValues();
        this.InitializeJudgementHealthWeightingValues();
        this.InitializeJudgementAccuracyWeightingValues();
    }

    /**
     * @param judgement 
     */
    public CalculateScore(judgement: Judgement): void {
        this.JudgementList.push(judgement);
        this.CurrentJudgements[judgement]++;
        this.Accuracy = this.CalculateAccuracy();

        // The player didn't miss, so update their combo & multiplier
        if (judgement != Judgement.Miss) {

            // Update Combo & Max Combo
            this.Combo++;

            if (this.Combo > this.MaxCombo)
                this.MaxCombo = this.Combo;
        } else {

            // Reset Combo
            this.Combo = 0;
        }

        let newHealth = this.Health + this.JudgementHealthWeighting[judgement];

        if (newHealth <= 0)
            this.Health = 0;
        else if (newHealth >= 100)
            this.Health = 100;
        else
            this.Health = newHealth;

        // Handle multiplayer stuff accordingly.
        if (this.Multiplayer)
            this.Multiplayer.CalculateHealth();

        this.CalculatePerformanceRating();

        // Add hit stats to the processor
        this.HitStats.push(new ScoreProcessorHitStat(judgement, this.PerformanceRating, this.Score, this.Accuracy, this.Health, 
            this.Combo, this.MaxCombo));
    }

    /**
     */
    public CalculateAccuracy(): number {
        let accuracy = 0;

        for (let j in this.CurrentJudgements)
            accuracy += this.CurrentJudgements[j] * this.JudgementAccuracyWeighting[j];

        return Math.max(accuracy / (this.GetTotalJudgementCount() * this.JudgementAccuracyWeighting[Judgement.Marvelous]), 0) * this.JudgementAccuracyWeighting[Judgement.Marvelous];
    }

    /**
     * Initializes the values for the judgement windows
     */
    private InitializeJudgementWindows(): void {
        this.JudgementWindows[Judgement.Marvelous] = 18;
        this.JudgementWindows[Judgement.Perfect] = 43;
        this.JudgementWindows[Judgement.Great] = 76;
        this.JudgementWindows[Judgement.Good] = 106;
        this.JudgementWindows[Judgement.Okay] = 127;
        this.JudgementWindows[Judgement.Miss] = 164;
    }

    /**
     * Initializes the values for the score weighting
     */
    private InitializeScoreWeightingValues(): void {
        this.JudgementScoreWeighting[Judgement.Marvelous] = 100;
        this.JudgementScoreWeighting[Judgement.Perfect] = 50;
        this.JudgementScoreWeighting[Judgement.Great] = 25;
        this.JudgementScoreWeighting[Judgement.Good] = 10;
        this.JudgementScoreWeighting[Judgement.Okay] = 5;
        this.JudgementScoreWeighting[Judgement.Miss] = 0;
    }

    /**
     * Initializes the values for the health weighting
     */
    private InitializeJudgementHealthWeightingValues(): void {
        this.JudgementHealthWeighting[Judgement.Marvelous] = 0.5;
        this.JudgementHealthWeighting[Judgement.Perfect] = 0.4;
        this.JudgementHealthWeighting[Judgement.Great] = 0.2;
        this.JudgementHealthWeighting[Judgement.Good] = -0.3;
        this.JudgementHealthWeighting[Judgement.Okay] = -4.5;
        this.JudgementHealthWeighting[Judgement.Miss] = -6.0;
    }

    /**
     * Initializes the values for the accuracy weighting
     */
    private InitializeJudgementAccuracyWeightingValues(): void {
        this.JudgementAccuracyWeighting[Judgement.Marvelous] = 100;
        this.JudgementAccuracyWeighting[Judgement.Perfect] = 96;
        this.JudgementAccuracyWeighting[Judgement.Great] = 50;
        this.JudgementAccuracyWeighting[Judgement.Good] = 25;
        this.JudgementAccuracyWeighting[Judgement.Okay] = -100;
        this.JudgementAccuracyWeighting[Judgement.Miss] = -50;
    }

    /**
     * This determines the max score.
     */
    private GetMaxMultiplierCount(): number {
        return this.MultiplierMaxIndex * this.MultiplierCountToIncreaseIndex;
    }
    
    /**
     * Calculates the total score from scratch. Needs play completion first!
     */
    public CalculateTotalScore(): void {
        this.CalculateSummedScore();

        for (let i = 0; i < this.JudgementList.length; i++) {
            if (this.JudgementList[i] != Judgement.Miss) {
                if (this.JudgementList[i] == Judgement.Good)
                    this.MultiplierCount -= this.MultiplierCountToIncreaseIndex;
                else
                    this.MultiplierCount++;
            } else {
                this.MultiplierCount -= this.MultiplierCountToIncreaseIndex * 2;
            }

            if (this.MultiplierCount < 0)
                this.MultiplierCount = 0;
            else if (this.MultiplierCount > this.GetMaxMultiplierCount())
                this.MultiplierCount = this.GetMaxMultiplierCount();

            this.MultiplierIndex = Math.floor(this.MultiplierCount / this.MultiplierCountToIncreaseIndex);
            this.ScoreCount += this.JudgementScoreWeighting[this.JudgementList[i]] + this.MultiplierIndex * this.MultiplierCountToIncreaseIndex;

            const standardizedMaxScore = 1000000;
            this.Score = Math.round(standardizedMaxScore * (this.ScoreCount / this.SummedScore));
        }
    }

    private CalculateSummedScore(): void {
        let summedScore: number = 0;

        // Multiplier doesn't increase after this amount
        let maxMultiplierCount = this.MultiplierMaxIndex * this.MultiplierCountToIncreaseIndex;
        
        for (let i = 1; i <= this.JudgementList.length && i < maxMultiplierCount; i++)
            summedScore += this.JudgementScoreWeighting[Judgement.Marvelous] + this.MultiplierCountToIncreaseIndex * Math.floor(i / this.MultiplierCountToIncreaseIndex);

        if (this.JudgementList.length >= this.GetMaxMultiplierCount())
            summedScore += (this.JudgementList.length - (maxMultiplierCount - 1)) * (this.JudgementScoreWeighting[Judgement.Marvelous] + maxMultiplierCount);

        this.SummedScore = summedScore;
    }

    /**
     * Calculates the performance rating of the current score.
     */
    private CalculatePerformanceRating(): void {
        // Failures/Eliminations should count as 0 rating
        if (this.IsFailed() || this.Multiplayer && (this.Multiplayer.IsRegeneratingHealth || this.Multiplayer.Lives == 0)) {
            this.PerformanceRating = 0;
            return;
        }

        this.PerformanceRating = this.DifficultyRating * Math.pow(this.Accuracy / 98, 6);
    }
}