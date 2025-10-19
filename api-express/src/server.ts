import express, { urlencoded, json } from "express";
import { notFound } from "./middleware/not-found";
import { error } from "./middleware/error";
import { auth } from "./lib/better-auth/auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000", // misalnya Next.js default port
    "http://localhost:4000"  // tambahkan port 4000
  ],
  credentials: true
}));
//auth
app.all("/api/auth/*", toNodeHandler(auth)); // For ExpressJS v4
// app.all("/api/auth/*splat", toNodeHandler(auth))
app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/', routes);

// app.use("/api", notesRouter);

app.use(notFound);
app.use(error);

export default app;
