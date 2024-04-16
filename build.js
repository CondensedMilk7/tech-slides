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
fs.cpSync("favicon.ico", path.join(BUILD_CONFIG.outputDir, "favicon.ico"));

entries.forEach((entry) => {
  console.log("🔨 Building", entry);
  const entryPath = path.join(BUILD_CONFIG.inputDir, entry);
  const outputPath = path.join(BUILD_CONFIG.outputDir, entry);

  execSync(
    `npm run slidev -- build --entry="${entryPath}/slides.md" --base="/${entry}/"`,
  );

  // Dist files can only be generated inside the entry folder,
  // so we move it to the global output directory
  fs.renameSync(path.join(entryPath, "dist"), outputPath);

  // Generate netlify _redirects rule for each entry
  // and put them in one file
  const redirectsLine = fs.readFileSync(
    path.join(outputPath, "_redirects"),
    "utf-8",
  );

  const redirectsPath = path.join(BUILD_CONFIG.outputDir, "_redirects");
  fs.appendFileSync(redirectsPath,  redirectsLine, "utf-8");

  console.log("✅ Finished", entry, "\n");
});

console.log("\n🤘", "All done");
console.log("✅ Built files in:", BUILD_CONFIG.outputDir);
