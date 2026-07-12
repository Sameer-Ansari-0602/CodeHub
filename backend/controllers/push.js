const fs = require("fs").promises;
const path = require("path");
const { S3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const configPath = path.join(repoPath, "config.json");
  const commitsPath = path.join(repoPath, "commits");

  try {
    let repoName = path.basename(process.cwd());
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configContent);
      if (config.repoName) {
        repoName = config.repoName;
      }
    } catch (err) {
      // Fallback if config is missing or doesn't have repoName
    }

    const commitDirs = await fs.readdir(commitsPath);
    for (let commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (let file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `repositories/${repoName}/commits/${commitDir}/${file}`,
          Body: fileContent,
        };
        await S3.upload(params).promise();
      }
    }

    console.log(`All commits pushed to S3 under repository '${repoName}'`);
  } catch (err) {
    console.error("Error while pushing the files to S3 : ", err);
  }
}

module.exports = { pushRepo };
