import * as fs from "fs";
import * as path from "path";

const cwd = process.cwd();
const outputFilePath = path.join(cwd, "src/generated.ts");
const inputFolder = path.join(cwd, "src/$");

const routes = fs.readdirSync(inputFolder);
console.log(routes);

fs.writeFileSync(
  outputFilePath,
  `
    import { createRouter } from "./lib/routing";
    createRouter({
        routes: [],
        target: document.getElementById("app");
    });
    `,
  "utf-8"
);
