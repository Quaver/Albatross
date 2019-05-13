import ScoreProcessor from "./ScoreProcessor";
import MultiplayerHealthType from "../multiplayer/MultiplayerHealthType";

export default class ScoreProcessorMultiplayer {
    /**
     * Reference to the player's score processor
     */
    public Processor: ScoreProcessor | undefined;

    /**
     * The type of health/life system that'll be used in multiplayer
     */
    public HealthType: MultiplayerHealthType;

    /**
     * The amount of lives the player has
     */
    public Lives: number = 3;

    /**
     * If the player has failed at any point during the game
     */
    public HasFailed: boolean = false;

    /**
     * If the player is currently failed and regenerating their health
     */
    public IsRegeneratingHealth: boolean = false;

    /**
     * If the user is eliminated from battle royale
     */
    public IsBattleRoyaleEliminated: boolean = false;

    /**
     * The player's rank for battle royale
     */
    public BattleRoyaleRank: number = 1;

    /**
     * @param healthType 
     * @param lives 
     */
    constructor(healthType: MultiplayerHealthType, lives: number) {
        this.HealthType = healthType;
        this.Lives = lives;
    }

    /**
     * Handle health/lives/elimination calculations within multiplayer
     */
    public CalculateHealth(): void {
        if (!this.Processor)
            throw new Error("Score Processor Undefined");

        if (this.Processor.Health <= 0)
            this.HasFailed = true;

        switch (this.HealthType) {
            // When player reaches 0 health, place them in a state where they have to reach 100 health
            // in order to be considered alive again            
            case MultiplayerHealthType.ManualRegeneration:
                if (this.Processor.Health == 0)
                    this.IsRegeneratingHealth = true;
                else if (this.Processor.Health == 100 && this.IsRegeneratingHealth)
                    this.IsRegeneratingHealth = false;
                break;            
            // If we're dealing with lives, remove lives from the player & restore their health back to 100    
            case MultiplayerHealthType.Lives:
                if (this.Processor.Health == 0) {
                    if (this.Lives == 0)
                        return;

                    this.Lives--;

                    if (this.Lives == 0)
                        return;

                    this.Processor.Health = 100;
                }
                break;
        }
    }
}