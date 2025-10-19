import express from "express";
import request from "supertest";
import { Router } from "express";
const testRoutes = Router();
const app = express()
app.get('/', (req, res) => {
    res.send("Hello World");
});

test("Test ExpressJS", async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello World");
});

test("Test ExpressJS", async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello World");
});
export default testRoutes;