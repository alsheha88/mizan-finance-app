import express from "express";
import apiRouter from "./src/routes/api.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandlingMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is listening on Port ${PORT}`);
});

