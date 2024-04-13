const BUILD_CONFIG = require("./build.config");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("⏳ Building files from:", BUILD_CONFIG.inputDir);

if (!fs.existsSync(BUILD_CONFIG.outputDir)) {
  fs.mkdirSync(BUILD_CONFIG.outputDir);
} else {
  fs.readdirSync(BUILD_CONFIG.outputDir).forEach((file) =>
    fs.rmSync(path.join(BUILD_CONFIG.outputDir, file), { recursive: true }),
  );
}

const listTemplate = fs.readFileSync(BUILD_CONFIG.listTemplate, "utf-8");
const entries = fs.readdirSync(BUILD_CONFIG.inputDir);

const entryListHTML = entries
  .map((entry) => `<li><a href="${entry}">${entry}</a></li>`)
  .join("");
const indexTemplate = listTemplate.replace(
  "{{ slides }}",
  `<ul>${entryListHTML}</ul>`,
);
fs.writeFileSync(
  path.join(BUILD_CONFIG.outputDir, "index.html"),
  indexTemplate,
);

entries.forEach((entry) => {
  console.log("🔨 Building", entry);
  const entryPath = path.join(BUILD_CONFIG.inputDir, entry);

  execSync(
    `npm run slidev -- build --entry="${entryPath}/slides.md" --base="/${entry}/"`,
  );

  // Dist files can only be generated inside the entry folder,
  // so we move it to the global dist path
  fs.renameSync(
    path.join(entryPath, "dist"),
    path.join(BUILD_CONFIG.outputDir, entry),
  );
  console.log("✅ Finished", entry, "\n");
});

console.log("\n🤘", "All done");
console.log("✅ Built files in:", BUILD_CONFIG.outputDir);
