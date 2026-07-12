const { S3, S3_BUCKET } = require("../config/aws-config");

const getS3Repositories = async (req, res) => {
  try {
    const data = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: "repositories/",
      Delimiter: "/",
    }).promise();

    const repoNames = (data.CommonPrefixes || []).map((prefix) => {
      const parts = prefix.Prefix.split("/");
      return parts[parts.length - 2];
    });

    const repositories = await Promise.all(
      repoNames.map(async (name) => {
        let description = "This repository is hosted in AWS S3 and managed via the apnaGit CLI.";
        try {
          // List files in the repository commits to search for README.md
          const repoData = await S3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: `repositories/${name}/commits/`,
          }).promise();

          // Find the latest key that ends with README.md by sorting by LastModified date descending
          const readmeObj = (repoData.Contents || [])
            .filter((obj) => obj.Key.endsWith("README.md"))
            .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];

          if (readmeObj) {
            const readmeData = await S3.getObject({
              Bucket: S3_BUCKET,
              Key: readmeObj.Key,
            }).promise();
            const readmeContent = readmeData.Body.toString("utf-8");

            const cleanLines = readmeContent
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line && !line.startsWith("#") && !line.startsWith("!"))
              .slice(0, 3)
              .join(" ");

            if (cleanLines) {
              description = cleanLines.substring(0, 160) + (cleanLines.length > 160 ? "..." : "");
            }
          }
        } catch (err) {
          // Fall back to default description if README not found or failed to read
        }
        return { name, description };
      })
    );

    res.json({ success: true, repositories });
  } catch (err) {
    console.error("Error fetching S3 repositories:", err);
    res.status(500).json({ error: "Failed to fetch repositories from S3" });
  }
};

const getS3Readme = async (req, res) => {
  const { repoName } = req.params;
  try {
    const repoData = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: `repositories/${repoName}/commits/`,
    }).promise();

    const readmeObj = (repoData.Contents || [])
      .filter((obj) => obj.Key.endsWith("README.md"))
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];

    if (!readmeObj) {
      return res.json({ success: true, readme: "No README.md content is currently available for this repository." });
    }

    const data = await S3.getObject({
      Bucket: S3_BUCKET,
      Key: readmeObj.Key,
    }).promise();
    const readmeContent = data.Body.toString("utf-8");
    res.json({ success: true, readme: readmeContent });
  } catch (err) {
    console.error("Error fetching S3 README:", err);
    res.status(500).json({ error: "Failed to fetch README.md from S3" });
  }
};

const getS3Files = async (req, res) => {
  const { repoName } = req.params;
  try {
    const repoData = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: `repositories/${repoName}/commits/`,
    }).promise();

    const objects = repoData.Contents || [];
    if (objects.length === 0) {
      return res.json({ success: true, files: [] });
    }

    // Find the latest file to determine the latest commit ID folder
    const latestFile = [...objects].sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];
    
    // Extract commit UUID from key
    const keyParts = latestFile.Key.split("/");
    const commitsIndex = keyParts.indexOf("commits");
    if (commitsIndex === -1 || commitsIndex + 1 >= keyParts.length) {
      return res.json({ success: true, files: [] });
    }
    const latestCommitId = keyParts[commitsIndex + 1];

    // Filter all objects that belong to the latest commit ID folder
    const latestCommitPrefix = `repositories/${repoName}/commits/${latestCommitId}/`;
    const commitFiles = objects
      .filter(obj => obj.Key.startsWith(latestCommitPrefix))
      .map(obj => obj.Key.replace(latestCommitPrefix, ""))
      .filter(fileName => fileName !== "commit.json"); // hide internal commit file

    res.json({ success: true, files: commitFiles });
  } catch (err) {
    console.error("Error fetching S3 files:", err);
    res.status(500).json({ error: "Failed to fetch files from S3" });
  }
};

module.exports = { getS3Repositories, getS3Readme, getS3Files };
