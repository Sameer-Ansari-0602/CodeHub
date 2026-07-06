const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.statis(201).json(issue);
  } catch (err) {
    console.error("Error during Issue creation : ", err.message);
    res.status(500).send("Server Error");
  }
};

const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not founnd" });
    }

    issue.title = title;
    issueRouter.description = description;
    issue.status = status;
    await issue.save();

    res.json(issue, { message: "Issue updated" });
  } catch (err) {
    console.error("Error during Issue updation : ", err.message);
    res.status(500).send("Server Error");
  }
};

const deleteIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not founnd" });
    }

    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during Issue deletioon : ", err.message);
    res.status(500).send("Server Error");
  }
};

const getAllIssues = async (req, res) => {
  const { id } = req.params;
  try {
    const issues = Issue.find({ repository: id });
    if (!issues) {
      return res.status(404).json({ error: "Issues not founnd" });
    }
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during Issue fetching : ", err.message);
    res.status(500).send("Server Error");
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not founnd" });
    }
    res.json(issue);
  } catch (err) {
    console.error("Error during Issue fetching : ", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
