import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { apiUrl } from "../../api";
import "./dashboard.css"; // Reuse dashboard/general styles

const CreateRepository = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public, false = Private
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("You must be logged in to create a repository.");
      return;
    }

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(apiUrl("/repo/create"), {
        name: name.trim(),
        description: description.trim(),
        visibility: visibility,
        owner: userId,
        content: [],
        issues: []
      });

      if (response.status === 201) {
        alert("Repository created successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating repository:", err);
      setError(err.response?.data?.error || "Failed to create repository. Ensure name is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", color: "white" }}>
        <h2>Create a new repository</h2>
        <p style={{ color: "#8b949e", marginBottom: "20px" }}>
          A repository contains all project files, including the revision history.
        </p>

        {error && <div style={{ color: "#ff7b72", marginBottom: "15px" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              Repository name <span style={{ color: "#ff7b72" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-project"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                backgroundColor: "#0d1117",
                color: "white"
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              Description <span style={{ color: "#8b949e", fontWeight: "normal" }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your repository"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #30363d",
                backgroundColor: "#0d1117",
                color: "white",
                height: "80px",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Visibility</label>
            
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === true}
                onChange={() => setVisibility(true)}
              />
              <div>
                <strong>Public</strong>
                <div style={{ fontSize: "12px", color: "#8b949e" }}>
                  Anyone on the internet can see this repository. You choose who can commit.
                </div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "10px" }}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === false}
                onChange={() => setVisibility(false)}
              />
              <div>
                <strong>Private</strong>
                <div style={{ fontSize: "12px", color: "#8b949e" }}>
                  You choose who can see and commit to this repository.
                </div>
              </div>
            </label>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #30363d", margin: "10px 0" }} />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#238636",
              color: "white",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              alignSelf: "flex-start"
            }}
          >
            {loading ? "Creating..." : "Create repository"}
          </button>
        </form>
      </div>
    </Navbar>
  );
};

export default CreateRepository;
