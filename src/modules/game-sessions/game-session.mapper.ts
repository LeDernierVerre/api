import GameSession from "./game-session.model.js";
import {
    GameSessionEntity,
    GameSessionState,
    GameSessionOptions,
    GameSessionPlayerSnapshot
} from "./game-session.types.js";

export const toGameSessionEntity = (model: GameSession): GameSessionEntity => {
    const state = parseState(model.state);
    const playersSnapshot = parsePlayersSnapshot(model.playersSnapshot);

    return {
        id: model.id,
        roomCode: model.roomCode,
        gameId: model.gameId,
        hostId: model.hostId,
        status: model.status,
        state,
        playersSnapshot,
        startedAt: model.startedAt,
        endedAt: model.endedAt ?? null,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        options: parseOptions(model.options)
    };
};

const parseOptions = (options: unknown): GameSessionOptions => {
    if (!options) {
        return {};
    }
    
    if (typeof options === "string") {
        try {
            return JSON.parse(options) as GameSessionOptions;
        } catch {
            return {};
        }
    }

    if (typeof options === "object") {
        return options as GameSessionOptions;
    }

    return {};
};

const parseState = (state: unknown): GameSessionState => {
    if (!state) {
        return {};
    }

    if (typeof state === "string") {
        try {
            return JSON.parse(state) as GameSessionState;
        } catch {
            return {};
        }
    }

    if (typeof state === "object") {
        return state as GameSessionState;
    }

    return {};
};

const parsePlayersSnapshot = (
    playersSnapshot: unknown
): GameSessionPlayerSnapshot[] => {
    if (!playersSnapshot) {
        return [];
    }

    if (typeof playersSnapshot === "string") {
        try {
            return JSON.parse(playersSnapshot) as GameSessionPlayerSnapshot[];
        } catch {
            return [];
        }
    }

    if (Array.isArray(playersSnapshot)) {
        return playersSnapshot as GameSessionPlayerSnapshot[];
    }

    return [];
};