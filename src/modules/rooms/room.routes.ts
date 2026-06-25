import { FastifyInstance } from "fastify";
import { authHook } from "../auth/auth.hook.js";
import { GameEnum, gameOptionsSchema } from "../games/game.enum.js";
import RoomService from "./room.service.js";

const roomService = new RoomService();

export default (app: FastifyInstance) => {
    app.addHook("preHandler", authHook);

    app.post("/", {
        schema: {
            body: {
                type: "object",
                required: ["gameId"],
                oneOf: Object.entries(gameOptionsSchema).map(([gameId, schema]) => ({
                    additionalProperties: false,
                    properties: {
                        gameId: {
                            const: gameId
                        },
                        options: schema
                    }
                }))
            }
        }
    }, async (request, reply) => {
        const { gameId, options } = request.body as {
            gameId: GameEnum;
            options?: Record<string, unknown>;
        };
        const { id: hostId, username } = request.user!;

        const room = await roomService.createRoom(hostId, username, gameId, options);
        return reply.code(201).send({ room });
    });

    app.get("/:code", {
        schema: {
            params: {
                type: "object",
                required: ["code"],
                additionalProperties: false,
                properties: {
                    code: {
                        type: "string",
                        minLength: 6,
                        maxLength: 6
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { code } = request.params as { code: string };
        const room = await roomService.getRoom(code);
        reply.code(200).send({room});
    });
    
    app.patch("/:code/start", {
        schema: {
            params: {
                type: "object",
                required: ["code"],
                additionalProperties: false,
                properties: {
                    code: {
                        type: "string",
                        minLength: 6,
                        maxLength: 6
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id: userId } = request.user!;
        const { code } = request.params as { code: string };

        const {room} = await roomService.startRoom(code, userId);

        return reply.send({
            code: room.code
        });
    });

    app.patch("/:code/leave", {
        preHandler: authHook,
        schema: {
            params: {
                type: "object",
                required: ["code"],
                additionalProperties: false,
                properties: {
                    code: {
                        type: "string",
                        minLength: 6,
                        maxLength: 6
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id: playerId } = request.user!;
        const { code } = request.params as { code: string };

        const room = await roomService.leaveRoom(code, playerId);

        return reply.send({ room });
    });
}