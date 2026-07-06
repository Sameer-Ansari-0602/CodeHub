const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const issue = require("../models/issueModel");

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User id" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server Error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (err) {
    console.error("Error during repositories fetching : ", err.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.find({
      _id: id,
    })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during repository fetchhing : ", err.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const repository = await Repository.find({
      name,
    })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during repository fetchhing : ", err.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  const userId = req.params.userID;

  if (!userId || userId === "null" || userId === "undefined") {
    return res.json({ message: "No user id provided", repositories: [] });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id", repositories: [] });
  }

  try {
    const repositories = await Repository.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length == 0) {
      return res.json({ message: "No repositories found", repositories: [] });
    }

    res.json({ message: "Repositories found", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).json({ message: "Server Error", repositories: [] });
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ error: "User repository not found" });
    }
    repo.content.push(content);
    repo.description = description;

    const updatedRepo = await repo.save();
    res.json({
      message: "Repository uptaded succesfully",
      repo: updatedRepo,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ error: "User repository not found" });
    }
    repo.visibility = !repo.visibility;

    const updatedRepo = await repo.save();
    res.json({
      message: "Repository visibility toggled successfully",
      repo: updatedRepo,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = await Repository.findByIdAndDelete(id);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
