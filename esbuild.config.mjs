import esbuild from "esbuild";
import {execSync} from "child_process";

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  target: ["esnext", "node16"],
};

esbuild.build({
  ...sharedConfig,
  format: "esm",
  outdir: "lib/esm",
}).catch(() => process.exit(1));

esbuild.build({
  ...sharedConfig,
  format: "cjs",
  outdir: "lib/cjs",
}).catch(() => process.exit(1));

execSync("tsc --project tsconfig.build.json", { stdio: "inherit" });
