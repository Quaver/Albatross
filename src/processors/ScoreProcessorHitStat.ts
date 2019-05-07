import Judgement from "../enums/Judgement";

export default class ScoreProcessorHitStat { 
    /**
     * The judgement the user received in this stat
     */
    public Judgement: Judgement;

    /**
     * The performance rating of the user at this point in time
     */
    public PerformanceRating: number;

    /**
     * The total score the player has
     */
    public Score: number;

    /**
     * The overall accuracy the player has
     */
    public Accuracy: number;

    /**
     * The current health the player has
     */
    public Health: number;

    /**
     * The user's current combo
     */
    public Combo: number;

    /**
     * The maximum combo the user has achieved
     */
    public MaxCombo: number;

    /**
     * @param judgement 
     * @param performanceRating 
     * @param score 
     * @param acc 
     * @param health 
     * @param combo 
     * @param maxCombo 
     */
    constructor(judgement: Judgement, performanceRating: number, score: number, acc: number, health: number, combo: number, maxCombo: number) {
        this.Judgement = judgement;
        this.PerformanceRating = performanceRating;
        this.Score = score;
        this.Accuracy = acc;
        this.Health = health;
        this.Combo = combo;
        this.MaxCombo = maxCombo;
    }
}