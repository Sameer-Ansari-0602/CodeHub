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
          <aside>
            <h2>Suggested Repositories</h2>
            {suggestedRepositories.map((repo) => (
              <div key={repo._id || repo.name}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))}
          </aside>
          <main>
            <h2>Yours Repositories</h2>
            <div id="search">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.map((repo) => (
              <div key={repo._id || repo.name}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))}
          </main>
          <aside>
            <h2>upcomming Events</h2>
            <ul>
              <li>
                <p>hello1</p>
              </li>
              <li>
                <p>hello2</p>
              </li>
              <li>
                <p>hello3</p>
              </li>
              <li>
                <p>hello4</p>
              </li>
            </ul>
          </aside>
        </section>
      </Navbar>
    </>
  );
};

export default Dashboard;
