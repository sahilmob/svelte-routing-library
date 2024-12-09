import * as fs from "fs";
import * as path from "path";

type Route = {
  layouts: [];
  relativePath: string;
  componentPath: string;
};

const cwd = process.cwd();
const outputFilePath = path.join(cwd, "src/generated.ts");
const inputFolder = path.join(cwd, "src/$");

function exploreFolders(rootRoutesDir: string) {
  const routes: Array<Route> = [];
  function _explore(folderPath: string) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) {
        _explore(filePath);
      } else {
        routes.push({
          componentPath: filePath,
          relativePath: path.relative(rootRoutesDir, filePath),
          layouts: [],
        });
      }
    }
  }

  _explore(rootRoutesDir);

  return routes;
}

const routes = exploreFolders(inputFolder);
console.log(routes);

fs.writeFileSync(
  outputFilePath,
  `
    import { createRouter } from "./lib/routing";

    createRouter({
        routes: [
            ${routes
              .map(({ relativePath, layouts }) => {
                const component = relativePath.replace(/\.svelte$/, "");
                const segments = component.split("/");
                if (segments[segments.length - 1] === "index") {
                  segments[segments.length - 1] = "";
                }
                segments.join("\\/");
                const regExp = `/^\\/${segments.join("\\/")}\\/?$/`;
                return `{
                url: ${regExp},
                params: [],
                components:[() => import('./$/${relativePath}')]
                }
              `;
              })
              .join(",\n")}
        ],
        target: document.getElementById("app")!
    });
    `,
  "utf-8"
);
