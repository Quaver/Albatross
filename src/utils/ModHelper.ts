import ModIdentifiers from "../enums/ModIdentifiers";
const bignum = require("bignum");

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
        else if ((bignum(mods).and(ModIdentifiers.Speed105X)) != 0)
                rate = 1.05;                    
        else if ((mods & ModIdentifiers.Speed11X) != 0)
                rate = 1.1;
        else if ((bignum(mods).and(ModIdentifiers.Speed115X)) != 0)
                rate = 1.15;                
        else if ((mods & ModIdentifiers.Speed12X) != 0)
                rate = 1.2;
        else if ((bignum(mods).and(ModIdentifiers.Speed125X)) != 0)
                rate = 1.25;                       
        else if ((mods & ModIdentifiers.Speed13X) != 0)
                rate = 1.3;
        else if ((bignum(mods).and(ModIdentifiers.Speed135X)) != 0)
                rate = 1.35;                
        else if ((mods & ModIdentifiers.Speed14X) != 0)
                rate = 1.4;
        else if ((bignum(mods).and(ModIdentifiers.Speed145X)) != 0)
                rate = 1.45;        
        else if ((mods & ModIdentifiers.Speed15X) != 0)
                rate = 1.5;
        else if ((bignum(mods).and(ModIdentifiers.Speed155X)) != 0)
                rate = 1.55;        
        else if ((mods & ModIdentifiers.Speed16X) != 0)
                rate = 1.6;
        else if ((bignum(mods).and(ModIdentifiers.Speed165X))!= 0)
                rate = 1.65;
        else if ((mods & ModIdentifiers.Speed17X) != 0)
                rate = 1.7;
        else if ((bignum(mods).and(ModIdentifiers.Speed175X)) != 0)
                rate = 1.75;        
        else if ((mods & ModIdentifiers.Speed18X) != 0)
                rate = 1.8;
        else if ((bignum(mods).and(ModIdentifiers.Speed185X))!= 0)
                rate = 1.85;         
        else if ((mods & ModIdentifiers.Speed19X) != 0)
                rate = 1.9;
        else if ((bignum(mods).and(ModIdentifiers.Speed195X)) != 0)
                rate = 1.95;
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
            
            if (!((bignum(mods).and(mod)) != 0))
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
                case ModIdentifiers.Speed105X:
                    modStrings.push("1.05x");
                    break;
                case ModIdentifiers.Speed11X:
                    modStrings.push("1.1x");
                    break;
                case ModIdentifiers.Speed115X:
                    modStrings.push("1.15x");
                    break;    
                case ModIdentifiers.Speed12X:
                    modStrings.push("1.2x");
                    break;
                case ModIdentifiers.Speed125X:
                    modStrings.push("1.25x");
                    break;
                case ModIdentifiers.Speed13X:
                    modStrings.push("1.3x");
                    break;
                case ModIdentifiers.Speed135X:
                    modStrings.push("1.35x");
                    break;
                case ModIdentifiers.Speed14X:
                    modStrings.push("1.4x");
                    break;
                case ModIdentifiers.Speed145X:
                    modStrings.push("1.45x");
                    break;   
                case ModIdentifiers.Speed15X:
                    modStrings.push("1.5x");
                    break;
                case ModIdentifiers.Speed155X:
                    modStrings.push("1.55x");
                    break;    
                case ModIdentifiers.Speed16X:
                    modStrings.push("1.6x");
                    break;
                case ModIdentifiers.Speed165X:
                    modStrings.push("1.65x");
                    break;    
                case ModIdentifiers.Speed17X:
                    modStrings.push("1.7x");
                    break;
                case ModIdentifiers.Speed175X:
                    modStrings.push("1.75x");
                    break;    
                case ModIdentifiers.Speed18X:
                    modStrings.push("1.8x");
                    break;
                case ModIdentifiers.Speed185X:
                    modStrings.push("1.85x");
                    break;
                case ModIdentifiers.Speed19X:
                    modStrings.push("1.9x");
                    break;
                case ModIdentifiers.Speed195X:
                    modStrings.push("1.95x");
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
                case ModIdentifiers.NoMiss:
                    modStrings.push("NM")
                    break;
                default:
                    break;
            }
        }
        

        let unique: any = {};

        modStrings.forEach(function(i) {
          if(!unique[i]) {
            unique[i] = true;
          }
        });

        modStrings = Object.keys(unique);
        
        return modStrings.join(", ");
    }

    public static GetModStrings(): Map<string, ModIdentifiers> {
        const map = new Map<string, ModIdentifiers>();

        map.set("NSV", ModIdentifiers.NoSliderVelocity);
        map.set("0.5x", ModIdentifiers.Speed05X);
        map.set("0.55x", ModIdentifiers.Speed055X);
        map.set("0.6x", ModIdentifiers.Speed06X);
        map.set("0.65x", ModIdentifiers.Speed065X);
        map.set("0.7x", ModIdentifiers.Speed07X);
        map.set("0.75x", ModIdentifiers.Speed075X);
        map.set("0.8x", ModIdentifiers.Speed08X);
        map.set("0.85x", ModIdentifiers.Speed085X);
        map.set("0.9x", ModIdentifiers.Speed09X);
        map.set("0.95x", ModIdentifiers.Speed095X);
        map.set("1.05x", ModIdentifiers.Speed105X);
        map.set("1.1x", ModIdentifiers.Speed11X);
        map.set("1.15x", ModIdentifiers.Speed115X);
        map.set("1.2x", ModIdentifiers.Speed12X);
        map.set("1.25x", ModIdentifiers.Speed125X);
        map.set("1.3x", ModIdentifiers.Speed13X);
        map.set("1.35x", ModIdentifiers.Speed135X);
        map.set("1.4x", ModIdentifiers.Speed14X);
        map.set("1.45x", ModIdentifiers.Speed145X);
        map.set("1.5x", ModIdentifiers.Speed15X);
        map.set("1.55x", ModIdentifiers.Speed155X);
        map.set("1.6x", ModIdentifiers.Speed16X);
        map.set("1.65x", ModIdentifiers.Speed165X);
        map.set("1.7x", ModIdentifiers.Speed17X);
        map.set("1.75x", ModIdentifiers.Speed175X);
        map.set("1.8x", ModIdentifiers.Speed18X);
        map.set("1.85x", ModIdentifiers.Speed185X);
        map.set("1.9x", ModIdentifiers.Speed19X);
        map.set("1.95x", ModIdentifiers.Speed195X);
        map.set("2.0x", ModIdentifiers.Speed20X);
        map.set("NF", ModIdentifiers.NoFail);
        map.set("MR", ModIdentifiers.Mirror);
        map.set("NLN", ModIdentifiers.NoLongNotes);
        map.set("FLN", ModIdentifiers.FullLN);
        map.set("INV", ModIdentifiers.Inverse);

        return map;
    }
}