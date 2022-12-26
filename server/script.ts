import { spawn } from "child_process";
const child = spawn("python", ["populate_database.py"]);
import getMongoDb from "./connections/mongodb";

export function runPython() {
  child.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  child.stderr.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stdout.on("close", (code: any) => {
    console.log(`child process exited with code ${code}`);
  });
}

export function killChildProcess() {
  child.kill("SIGKILL");
}
