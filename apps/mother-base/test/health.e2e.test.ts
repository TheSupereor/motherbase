import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify"
import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module.js"

describe("GET /health", () => {
    let app: NestFastifyApplication;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('Expects to be healthy', async () => {
        const response = await app.inject({
            method: "GET",
            url: "/health",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: "ok" });
    });

});