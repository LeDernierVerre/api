import BaseGame from "./base-game.js";
import NinetySevenGame from "./ninety-seven/ninety-seven.game.js";
import PmuGame from "./pmu/pmu.game.js";

export enum GameEnum {
    NINETY_SEVEN = "ninety-seven",
    PMU = "pmu"
}

type GameConstructor = new (...args: any[]) => BaseGame<{}>;

export const gameClasses: Record<GameEnum, GameConstructor> = {
    [GameEnum.NINETY_SEVEN]: NinetySevenGame,
    [GameEnum.PMU]: PmuGame
};

export const gameOptionsSchema: Record<GameEnum, any> = {
    [GameEnum.NINETY_SEVEN]: {
        type: "object",
        additionalProperties: false,
        properties: {}
    },
    [GameEnum.PMU]: {
        type: "object",
        additionalProperties: false,
        properties: {
            stepNumber: {
                type: "integer",
                minimum: 1,
                maximum: 13
            }
        }
    }
}