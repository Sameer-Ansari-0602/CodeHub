import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { apiUrl } from "../../api";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

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
              {searchResults.length === 0 ? (
                <p style={{ color: "#8b949e", fontSize: "13px" }}>No repositories found</p>
              ) : (
                searchResults.map((repo) => (
                  <div key={repo._id || repo.name} className="repo-item">
                    <div className="repo-item-header">
                      <span className="repo-icon">📁</span>
                      <a href={`/repo/${repo._id}`} className="repo-link">
                        {repo.name}
                      </a>
                    </div>
                    {repo.description && <p className="repo-desc">{repo.description}</p>}
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Center Main Area - Explore/Suggested Repositories */}
          <main className="dashboard-main-content">
            <div className="suggested-title-bar">
              <h2>Explore Repositories</h2>
            </div>
            <div className="suggested-card-grid">
              {suggestedRepositories.length === 0 ? (
                <p style={{ color: "#8b949e", fontSize: "13px" }}>No suggested repositories available</p>
              ) : (
                suggestedRepositories.map((repo) => (
                  <div key={repo._id || repo.name} className="suggested-card">
                    <div>
                      <h4>{repo.name}</h4>
                      <p>{repo.description || "No description provided."}</p>
                    </div>
                    <div className="suggested-card-footer">
                      <span className="visibility-badge">
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                      <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        ⭐ Star
                      </span>
                    </div>
                  </div>
                ))
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
