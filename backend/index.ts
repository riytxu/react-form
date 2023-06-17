import express, { Request, Response, json } from "express";
import cors from "cors";
import { IUser } from "./types";
import { data } from "./data";

const app = express();
const PORT = 5000;

app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
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
  }, 5000);
});

app.listen(PORT, () => {
  console.log(`Backend work at http://localhost:${PORT}`);
});
