import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { apiUrl } from "../../api";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [starredRepoIds, setStarredRepoIds] = useState([]);
  const [s3Repositories, setS3Repositories] = useState([]);
  const [activeTab, setActiveTab] = useState("explore");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId || userId === "null" || userId === "undefined") {
      setRepositories([]);
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(apiUrl(`/repo/user/${userId}`));
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories : ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(apiUrl(`/repo/all`));
        const data = await response.json();
        setSuggestedRepositories(data);
        console.log("Suggested repositories fetched:", data);
      } catch (err) {
        console.error("Error while fetching repositories : ", err);
      }
    };

    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(apiUrl(`/userProfile/${userId}`));
        const data = await response.json();
        setStarredRepoIds(data.starRepos || []);
      } catch (err) {
        console.error("Error fetching starred repos:", err);
      }
    };

    const fetchS3Repositories = async () => {
      try {
        const response = await fetch(apiUrl("/repo/s3-list"));
        const data = await response.json();
        if (data.success) {
          setS3Repositories(data.repositories || []);
        }
      } catch (err) {
        console.error("Error fetching S3 repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    fetchStarredRepos();
    fetchS3Repositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(suggestedRepositories);
    } else {
      const filteredRepo = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, suggestedRepositories]);

  const handleStar = async (repoId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to star a repository!");
      return;
    }

    try {
      const response = await fetch(apiUrl("/star"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, repoId }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.starred) {
          setStarredRepoIds([...starredRepoIds, repoId]);
        } else {
          setStarredRepoIds(starredRepoIds.filter((id) => id !== repoId));
        }
      } else {
        alert(data.error || "Failed to star repository");
      }
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  const filteredS3Repos = searchQuery === ""
    ? s3Repositories
    : s3Repositories.filter((repoName) =>
        repoName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <Navbar>
        <section id="dashboard">
          {/* Left Sidebar - Yours Repositories */}
          <aside className="dashboard-left-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h2>Top Repositories</h2>
              <a href="/create" className="btn-new-repo">
                New
              </a>
            </div>
            <div id="search">
              <input
                type="text"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="repo-list">
              {repositories.length === 0 ? (
                <p style={{ color: "#8b949e", fontSize: "13px" }}>No repositories found</p>
              ) : (
                repositories.map((repo) => (
                  <div key={repo._id || repo.name} className="repo-item">
                    <div className="repo-item-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="repo-icon">📁</span>
                        <a href={`/repo/${repo._id}`} className="repo-link">
                          {repo.name}
                        </a>
                      </div>
                      <span 
                        onClick={() => handleStar(repo._id)} 
                        style={{ cursor: "pointer", fontSize: "14px", color: starredRepoIds.includes(repo._id) ? "#e3b341" : "#8b949e" }}
                        title={starredRepoIds.includes(repo._id) ? "Unstar" : "Star"}
                      >
                        {starredRepoIds.includes(repo._id) ? "★" : "☆"}
                      </span>
                    </div>
                    {repo.description && <p className="repo-desc">{repo.description}</p>}
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Center Main Area - Explore/Suggested Repositories */}
          <main className="dashboard-main-content">
            <div className="suggested-title-bar" style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <h2 
                onClick={() => setActiveTab("explore")}
                style={{ 
                  cursor: "pointer", 
                  paddingBottom: "8px", 
                  borderBottom: activeTab === "explore" ? "2px solid #f78166" : "2px solid transparent",
                  color: activeTab === "explore" ? "#e6edf3" : "#8b949e",
                  fontWeight: activeTab === "explore" ? "600" : "400",
                  transition: "all 0.2s"
                }}
              >
                Explore Repositories
              </h2>
              <h2 
                onClick={() => setActiveTab("s3")}
                style={{ 
                  cursor: "pointer", 
                  paddingBottom: "8px", 
                  borderBottom: activeTab === "s3" ? "2px solid #f78166" : "2px solid transparent",
                  color: activeTab === "s3" ? "#e6edf3" : "#8b949e",
                  fontWeight: activeTab === "s3" ? "600" : "400",
                  transition: "all 0.2s"
                }}
              >
                S3 Synced Repositories
              </h2>
            </div>
            <div className="suggested-card-grid">
              {activeTab === "explore" ? (
                searchResults.length === 0 ? (
                  <p style={{ color: "#8b949e", fontSize: "13px" }}>No repositories match your search query.</p>
                ) : (
                  searchResults.map((repo) => (
                    <div key={repo._id || repo.name} className="suggested-card">
                      <div>
                        <a href={`/repo/${repo._id}`} className="repo-link" style={{ textDecoration: "none" }}>
                          <h4 style={{ margin: "0 0 6px 0", color: "#58a6ff", cursor: "pointer" }}>{repo.name}</h4>
                        </a>
                        <p>{repo.description || "No description provided."}</p>
                      </div>
                      <div className="suggested-card-footer">
                        <span className="visibility-badge">
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                        <span 
                          onClick={() => handleStar(repo._id)} 
                          style={{ 
                            cursor: "pointer", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "4px",
                            color: starredRepoIds.includes(repo._id) ? "#e3b341" : "#8b949e"
                          }}
                        >
                          {starredRepoIds.includes(repo._id) ? "★ Starred" : "☆ Star"}
                        </span>
                      </div>
                    </div>
                  ))
                )
              ) : (
                filteredS3Repos.length === 0 ? (
                  <p style={{ color: "#8b949e", fontSize: "13px" }}>No S3 repositories match your search query.</p>
                ) : (
                  filteredS3Repos.map((repoName) => (
                    <div key={repoName} className="suggested-card">
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", color: "#58a6ff" }}>{repoName}</h4>
                        <p style={{ color: "#8b949e", fontSize: "13px", marginTop: "8px" }}>
                          This repository is hosted in AWS S3 and managed via the <code>apnaGit</code> CLI.
                        </p>
                        <div style={{ 
                          backgroundColor: "#0d1117", 
                          padding: "10px 12px", 
                          borderRadius: "6px", 
                          marginTop: "12px",
                          border: "1px solid #30363d",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          color: "#c9d1d9"
                        }}>
                          <span style={{ color: "#8b949e" }}># To pull this repository locally:</span>
                          <br />
                          node backend/index.js init {repoName}
                          <br />
                          node backend/index.js pull
                        </div>
                      </div>
                      <div className="suggested-card-footer" style={{ marginTop: "12px" }}>
                        <span className="visibility-badge" style={{ borderColor: "#238636", color: "#3fb950" }}>
                          S3 Bucket Synced
                        </span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </main>

          {/* Right Sidebar - Upcoming Events */}
          <aside className="dashboard-right-sidebar">
            <h2>Upcoming Events</h2>
            <ul className="events-list">
              <li className="event-item">
                <p>🌐 GitHub Universe 2026</p>
                <span>The global developer event of the year. Virtual passes are free. • Nov 10-12</span>
              </li>
              <li className="event-item">
                <p>💡 Open Source Hackathon</p>
                <span>Collaborate and build the future of dev tools. • Registration Open</span>
              </li>
              <li className="event-item">
                <p>🎙️ Tech Talk: React 19 & Next.js</p>
                <span>Live stream on new React features and compiler. • Friday, 6:00 PM</span>
              </li>
              <li className="event-item">
                <p>☕ CodeHub Dev Meetup</p>
                <span>Local community networking, lightning talks, and QA. • Sunday, 4:00 PM</span>
              </li>
            </ul>
          </aside>
        </section>
      </Navbar>
    </>
  );
};

export default Dashboard;
