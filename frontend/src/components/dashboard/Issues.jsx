import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { apiUrl } from "../../api";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Provide some high-quality mock issues as fallback if backend is empty
  const mockIssues = [
    {
      _id: "issue1",
      title: "CORS preflight request blocked on Vercel deployment",
      description: "Access to XMLHttpRequest at 'https://code-hub-live.vercel.app/login' from origin 'https://code-hub-app.vercel.app' has been blocked by CORS policy.",
      status: "open",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      repoName: "CodeHub",
      author: "Sameer"
    },
    {
      _id: "issue2",
      title: "Mongoose users.findOne() buffering timeout after cold start",
      description: "Serverless functions are timing out while trying to establish a connection to the MongoDB Atlas cluster on new invocations.",
      status: "open",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
      repoName: "apnaGit",
      author: "ansar"
    },
    {
      _id: "issue3",
      title: "Implement file explorer UI inside repository details page",
      description: "Users should be able to click on a repository in the dashboard and browse the directory/file tree of S3 commits in the browser.",
      status: "open",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      repoName: "CodeHub-Frontend",
      author: "developer"
    },
    {
      _id: "issue4",
      title: "Missing AWS S3 credentials in backend environment config",
      description: "CredentialsError in AWS SDK config causes push/pull operations to crash under the CLI yargs command runner.",
      status: "closed",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
      repoName: "apnaGit-CLI",
      author: "Sameer"
    }
  ];

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(apiUrl("/issue/all"));
        if (response.data && response.data.length > 0) {
          setIssues(response.data);
        } else {
          setIssues(mockIssues);
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
        // Fallback to mock issues if server endpoint fails/times out
        setIssues(mockIssues);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <Navbar>
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", color: "white" }}>
        
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", fontWeight: "600" }}>Issues</h2>
            <p style={{ margin: 0, color: "#8b949e", fontSize: "14px" }}>
              Track tasks, bugs, and feature requests across all repositories.
            </p>
          </div>
          <button style={{
            backgroundColor: "#238636",
            color: "white",
            border: "1px solid rgba(240,246,252,0.1)",
            borderRadius: "6px",
            padding: "5px 16px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "not-allowed",
            opacity: 0.8
          }} title="Creation from web app is read-only">
            New issue
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: "flex",
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderBottom: "none",
          borderRadius: "6px 6px 0 0",
          padding: "16px",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
            🟢 {issues.filter(i => i.status !== "closed").length} Open
          </span>
          <span style={{ fontSize: "14px", color: "#8b949e", display: "flex", alignItems: "center", gap: "5px", marginLeft: "10px" }}>
            🔴 {issues.filter(i => i.status === "closed").length} Closed
          </span>
        </div>

        {/* Issues List Container */}
        <div style={{
          border: "1px solid #30363d",
          borderRadius: "0 0 6px 6px",
          backgroundColor: "#0d1117"
        }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8b949e" }}>Loading issues...</div>
          ) : (
            issues.map((issue, index) => (
              <div
                key={issue._id || index}
                style={{
                  display: "flex",
                  padding: "16px",
                  borderBottom: index === issues.length - 1 ? "none" : "1px solid #30363d",
                  transition: "background-color 0.2s",
                  alignItems: "flex-start",
                  gap: "12px"
                }}
                className="issue-list-item"
              >
                {/* State Icon */}
                <span style={{ fontSize: "16px", marginTop: "2px" }} title={issue.status === "closed" ? "Closed Issue" : "Open Issue"}>
                  {issue.status === "closed" ? "🔴" : "🟢"}
                </span>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", fontSize: "16px", color: "#adbac7", cursor: "pointer" }}>
                      {issue.title}
                    </span>
                    <span style={{
                      fontSize: "12px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      backgroundColor: "#1f6feb",
                      color: "white",
                      fontWeight: "500"
                    }}>
                      {issue.repoName || "Repository"}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div style={{ fontSize: "12px", color: "#8b949e" }}>
                    #{index + 1} opened {new Date(issue.createdAt || Date.now()).toLocaleDateString()} by {issue.author || "User"}
                  </div>

                  {/* Optional Description snippet */}
                  {issue.description && (
                    <p style={{
                      margin: "8px 0 0 0",
                      fontSize: "13px",
                      color: "#8b949e",
                      lineHeight: "1.4",
                      backgroundColor: "#161b22",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #21262d"
                    }}>
                      {issue.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Issues;
