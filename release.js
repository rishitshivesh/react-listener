const { execSync } = require("child_process");

const versionType = process.argv[2] || "patch"; // Default to "patch"
const packageJson = require("./package.json");
const packageName = packageJson.name;
const newVersion = execSync(`yarn version ${versionType}`, { encoding: "utf-8" }).trim();

// Build the package
console.log("📦 Building the package...");
execSync("yarn build", { stdio: "inherit" });

// Commit the version bump
console.log(`📌 Committing version bump to ${newVersion}...`);
execSync(`git add .`, { stdio: "inherit" });
execSync(`git commit -m "chore(release): bump ${packageName} to ${newVersion}"`, { stdio: "inherit" });

// Tag the release
console.log(`🏷️  Tagging release ${newVersion}...`);
execSync(`git tag v${newVersion}`, { stdio: "inherit" });

// Push changes
console.log("🚀 Pushing changes and tags to remote...");
execSync("git push origin HEAD", { stdio: "inherit" });


// Push changes
console.log("🚀 Pushing changes and tags to remote...");
execSync("git push --tags", { stdio: "inherit" });

// Publish to npm
console.log("📢 Publishing to npm...");
execSync("yarn publish --access public", { stdio: "inherit" });

console.log(`✅ Successfully released ${packageName} v${newVersion}`);
