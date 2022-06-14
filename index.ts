import express, { Express, Request, Response } from "express";
import { router as data, router } from "./routers/data";

const app: Express = express();
const port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("My server using GraphQL, JWT, Typescript");
});

app.use("/users", data);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
