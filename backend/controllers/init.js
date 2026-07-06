const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit"); // creating a hidden folder
  const commitPath = path.join(repoPath, "commits"); // creating another folder in the hidden folder

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"), // creating a file
      JSON.stringify({ bucket: process.env.S3_BUCKET }),
    );

    console.log("Repository Initailised");
  } catch (err) {
    console.error("Error Initialising Repository", err);
  }
}

module.exports = { initRepo };
