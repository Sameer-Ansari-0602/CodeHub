const fs = require("fs").promises;
const path = require("path");
const { S3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    }).promise();

    const objects = data.Contents;

    for (let obj of objects) {
      const key = obj.Key;
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop(),
      );

      await fs.mkdir(commitDir, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };
      const fileContent = await S3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, key), fileContent.Body);
    }
    console.log("All commits pulled from s3");
  } catch (err) {
    console.error("Unable to pull : ", err);
  }
}

module.exports = { pullRepo };
