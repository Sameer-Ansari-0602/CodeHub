import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { apiUrl } from "../../api";

const StarredRepositories = () => {
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStarredRepos = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("You must be logged in to view starred repositories.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile to get starred repository IDs
        const userRes = await axios.get(apiUrl(`/userProfile/${userId}`));
        const starRepoIds = userRes.data.starRepos || [];

        if (starRepoIds.length === 0) {
          setStarredRepos([]);
          setLoading(false);
          return;
        }

        // Fetch details for each starred repository
        const repoPromises = starRepoIds.map(async (id) => {
          try {
            const res = await axios.get(apiUrl(`/repo/${id}`));
            // The backend returns an array from findById/find
            return Array.isArray(res.data) ? res.data[0] : res.data;
          } catch (e) {
            console.error(`Error fetching repo details for ID ${id}:`, e);
            return null;
          }
        });

        const repos = await Promise.all(repoPromises);
        setStarredRepos(repos.filter(r => r !== null));
      } catch (err) {
        console.error("Error fetching starred repositories:", err);
        setError("Failed to load starred repositories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStarredRepos();
  }, []);

  return (
    <Navbar>
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", color: "white" }}>
        <h2>Starred Repositories</h2>
        <p style={{ color: "#8b949e", marginBottom: "20px" }}>
          Repositories you have starred will appear here.
        </p>

        {loading && <p>Loading starred repositories...</p>}
        {error && <div style={{ color: "#ff7b72" }}>{error}</div>}

        {!loading && !error && starredRepos.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            border: "1px dashed #30363d",
            borderRadius: "6px",
            color: "#8b949e"
          }}>
            <h3>You don't have any starred repositories yet</h3>
            <p>As you explore repositories on GitHub clone, star them to keep track of them here.</p>
          </div>
        )}

        {!loading && starredRepos.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {starredRepos.map((repo) => (
              <div
                key={repo._id || repo.name}
                style={{
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #30363d",
                  backgroundColor: "#0d1117"
                }}
              >
                <h4 style={{ margin: "0 0 5px 0", color: "#58a6ff" }}>{repo.name}</h4>
                <p style={{ margin: "0 0 10px 0", color: "#8b949e", fontSize: "14px" }}>
                  {repo.description || "No description provided."}
                </p>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  border: "1px solid #30363d",
                  color: "#8b949e"
                }}>
                  {repo.visibility ? "Public" : "Private"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default StarredRepositories;
