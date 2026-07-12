const fs = require("fs").promises;
const path = require("path");
const { S3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const configPath = path.join(repoPath, "config.json");
  const commitsPath = path.join(repoPath, "commits");

  try {
    let repoName = null;
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configContent);
      if (config.repoName) {
        repoName = config.repoName;
      }
    } catch (err) {
      // Config or repoName missing
    }

    const prefix = repoName ? `repositories/${repoName}/commits/` : "commits/";

    const data = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: prefix,
    }).promise();

    const objects = data.Contents;
    if (!objects || objects.length === 0) {
      console.log("No commits found in S3.");
      return;
    }

    for (let obj of objects) {
      const key = obj.Key;
      const relativeKey = key.includes("commits/")
        ? key.substring(key.indexOf("commits/"))
        : key;

      const commitDir = path.join(
        commitsPath,
        path.dirname(relativeKey).split("/").pop(),
      );

      await fs.mkdir(commitDir, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };
      const fileContent = await S3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, relativeKey), fileContent.Body);
    }
    console.log("All commits pulled from S3");
  } catch (err) {
    console.error("Unable to pull : ", err);
  }
}

module.exports = { pullRepo };
