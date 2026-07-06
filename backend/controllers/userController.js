const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      return res.status(400).json({
        message:
          field === "username"
            ? "Username already exists!"
            : "Email already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await User.create(newUser);

    const token = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET_KEY || "mysecretkey",
      { expiresIn: "1h" },
    );

    res.status(201).json({ token, userId: result._id.toString() });
  } catch (err) {
    console.error("Error during signup", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY || "mysecretkey",
      {
        expiresIn: "1h",
      },
    );
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

const getUserProfile = async (req, res) => {
  const currentID = req.params.id;
  try {
    const user = await User.findById(currentID);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

const updateUserProfile = async (req, res) => {
  const currentID = req.params.id;
  const { email, password } = req.body;
  try {
    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      updateFields.password = hashedPass;
    }

    const result = await User.findByIdAndUpdate(
      currentID,
      { $set: updateFields },
      { new: true },
    );
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(result);
  } catch (err) {
    console.error("Error during updating profile : ", err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

const deleteUserProfile = async (req, res) => {
  const currentID = req.params.id;
  try {
    const result = await User.findByIdAndDelete(currentID);
    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User profile deleted" });
  } catch (err) {
    console.error("Error during deleting profile : ", err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

const starRepository = async (req, res) => {
  const { userId, repoId } = req.body;

  if (!userId || !repoId) {
    return res.status(400).json({ error: "userId and repoId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isStarred = user.starRepos.includes(repoId);

    if (isStarred) {
      user.starRepos = user.starRepos.filter((id) => id.toString() !== repoId.toString());
      await user.save();
      return res.json({ message: "Repository unstarred successfully", starred: false });
    } else {
      user.starRepos.push(repoId);
      await user.save();
      return res.json({ message: "Repository starred successfully", starred: true });
    }
  } catch (err) {
    console.error("Error toggling star on repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  starRepository,
};
