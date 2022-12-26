import express from "express";
import getMongoDb from "./connections/mongodb";
import { runPython, killChildProcess } from "./script";
import cors from "cors";

const app = express();
const db = await getMongoDb();

const PORT = 3000;

runPython();

app.use(cors());

app.get("/get_football_data", (req, res) => {
  db.collection("football")
    .find({})
    .toArray()
    .then((data) => res.status(200).send(data));
});

app.get("/empty_database", (req, res) => {
  db.collection("test")
    .deleteMany({})
    .then(() => res.status(200).send("Deleted records in the database"));
});

const server = app.listen(PORT, () =>
  console.log("Server listen on port \x1b[33m%s\x1b[0m", `${PORT}`)
);

process.on("SIGINT", function () {
  console.log("SIGINT signal received..");
  killChildProcess();
  process.exit(0);
});
