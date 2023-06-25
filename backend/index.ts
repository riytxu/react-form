import express, { Request, Response, json } from "express";
import cors from "cors";
import { IUser } from "./types";
import { data } from "./data";

const app = express();
const PORT = Number(process.env.BACKEND_PORT);

app.use(json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.post("/search", (req: Request, res: Response) => {
  setTimeout(() => {
    const requestData: IUser = req.body;
    const { email, number } = requestData;
    const filtredData = data.filter(user => {
      return user.email === email && (!number || user.number === number);
    });
    res.json(filtredData);
  }, Number(process.env.REQEST_DELAY));
});

app.listen(PORT, () => {
  console.log(`Backend work at port: ${PORT}`);
});
