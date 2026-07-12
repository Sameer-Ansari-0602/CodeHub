const { S3, S3_BUCKET } = require("../config/aws-config");

const getS3Repositories = async (req, res) => {
  try {
    const data = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: "repositories/",
      Delimiter: "/",
    }).promise();

    const repositories = (data.CommonPrefixes || []).map((prefix) => {
      const parts = prefix.Prefix.split("/");
      return parts[parts.length - 2];
    });

    res.json({ success: true, repositories });
  } catch (err) {
    console.error("Error fetching S3 repositories:", err);
    res.status(500).json({ error: "Failed to fetch repositories from S3" });
  }
};

module.exports = { getS3Repositories };
