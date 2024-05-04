import request from "supertest";
import { app, server, io } from "./index";

describe("Express App", () => {
    afterAll((done) => {
      server.close(done);
    });
    
    it("should start the server and respond with 404 for an unknown route", async () => {
        const response = await request(app).get("/")
        expect(response.status).toBe(404);
    })

    it.skip("responds with 200 for GET /", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
    });

  });
