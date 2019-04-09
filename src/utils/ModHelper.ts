import ModIdentifiers from "../enums/ModIdentifiers";

export default class ModHelper {
    /**
     * Gets the adio rate value from mods.
     * @param mods
     * @constructor
     */
    public static GetRateFromMods(mods: ModIdentifiers): number {
        let rate = 1.0;

        // Map mods to rate.
        if ((mods & ModIdentifiers.Speed05X) != 0)
            rate = 0.5;
        else if ((mods & ModIdentifiers.Speed055X) != 0)
            rate = 0.55;
        else if ((mods & ModIdentifiers.Speed06X) != 0)
                rate = 0.6;
        else if ((mods & ModIdentifiers.Speed065X) != 0)
                rate = 0.65;                
        else if ((mods & ModIdentifiers.Speed07X) != 0)
                rate = 0.7;
        else if ((mods & ModIdentifiers.Speed075X) != 0)
                rate = 0.75;                    
        else if ((mods & ModIdentifiers.Speed08X) != 0)
                rate = 0.8;
        else if ((mods & ModIdentifiers.Speed085X) != 0)
                rate = 0.85;                    
        else if ((mods & ModIdentifiers.Speed09X) != 0)
                rate = 0.9;
        else if ((mods & ModIdentifiers.Speed095X) != 0)
                rate = 0.95;                    
        else if ((mods & ModIdentifiers.Speed11X) != 0)
                rate = 1.1;
        else if ((mods & ModIdentifiers.Speed12X) != 0)
                rate = 1.2;
        else if ((mods & ModIdentifiers.Speed13X) != 0)
                rate = 1.3;
        else if ((mods & ModIdentifiers.Speed14X) != 0)
                rate = 1.4;
        else if ((mods & ModIdentifiers.Speed15X) != 0)
                rate = 1.5;
        else if ((mods & ModIdentifiers.Speed16X) != 0)
                rate = 1.6;
        else if ((mods & ModIdentifiers.Speed17X) != 0)
                rate = 1.7;
        else if ((mods & ModIdentifiers.Speed18X) != 0)
                rate = 1.8;
        else if ((mods & ModIdentifiers.Speed19X) != 0)
                rate = 1.9;
        else if ((mods & ModIdentifiers.Speed20X) != 0)
                rate = 2.0;
    
        return rate;
    }

    /**
     * Gets mods in string format.
     * @constructor
     * @param mods
     */
    public static GetModsString(mods: ModIdentifiers): string {
        if (mods <= 0)
            return "None";
        
        let modStrings: string[] = [];
        
        for (let item in ModIdentifiers) {
            // @ts-ignore
            const mod: ModIdentifiers = ModIdentifiers[item] as ModIdentifiers;

            if (mod == ModIdentifiers.None)
                continue;
            
            if (!((mods & mod) != 0))
                continue;

            switch (mod)
            {
                case ModIdentifiers.NoSliderVelocity:
                    modStrings.push("NSV");
                    break;
                case ModIdentifiers.Speed05X:
                    modStrings.push("0.5x");
                    break;
                case ModIdentifiers.Speed055X:
                    modStrings.push("0.55x");
                    break;
                case ModIdentifiers.Speed06X:
                    modStrings.push("0.6x");
                    break;
                case ModIdentifiers.Speed065X:
                    modStrings.push("0.65x");
                    break;    
                case ModIdentifiers.Speed07X:
                    modStrings.push("0.7x");
                    break;
                case ModIdentifiers.Speed075X:
                    modStrings.push("0.75x");
                    break;    
                case ModIdentifiers.Speed08X:
                    modStrings.push("0.8x");
                    break;
                 case ModIdentifiers.Speed085X:
                    modStrings.push("0.85x");
                    break;
                case ModIdentifiers.Speed09X:
                    modStrings.push("0.9x");
                    break;
                case ModIdentifiers.Speed095X:
                    modStrings.push("0.95x");
                    break;
                case ModIdentifiers.Speed11X:
                    modStrings.push("1.1x");
                    break;
                case ModIdentifiers.Speed12X:
                    modStrings.push("1.2x");
                    break;
                case ModIdentifiers.Speed13X:
                    modStrings.push("1.3x");
                    break;
                case ModIdentifiers.Speed14X:
                    modStrings.push("1.4x");
                    break;
                case ModIdentifiers.Speed15X:
                    modStrings.push("1.5x");
                    break;
                case ModIdentifiers.Speed16X:
                    modStrings.push("1.6x");
                    break;
                case ModIdentifiers.Speed17X:
                    modStrings.push("1.7x");
                    break;
                case ModIdentifiers.Speed18X:
                    modStrings.push("1.8x");
                    break;
                case ModIdentifiers.Speed19X:
                    modStrings.push("1.9x");
                    break;
                case ModIdentifiers.Speed20X:
                    modStrings.push("2.0x");
                    break;
                case ModIdentifiers.Strict:
                    modStrings.push("Strict");
                    break;
                case ModIdentifiers.Chill:
                    modStrings.push("Chill");
                    break;
                case ModIdentifiers.Autoplay:
                    modStrings.push("Autoplay");
                    break;
                case ModIdentifiers.Paused:
                    modStrings.push("Paused");
                    break;
                case ModIdentifiers.Mirror:
                    modStrings.push("Mirror");
                    break;
                case ModIdentifiers.FullLN:
                    modStrings.push("Full LN");
                    break;
                case ModIdentifiers.Inverse:
                    modStrings.push("Inverse");
                    break;
                case ModIdentifiers.NoLongNotes:
                    modStrings.push("No Long Notes");
                    break;
                case ModIdentifiers.NoFail:
                    modStrings.push("No Fail");
                    break;
                default:
                    break;
            }
        }
        
        return modStrings.join(", ");
    }
}