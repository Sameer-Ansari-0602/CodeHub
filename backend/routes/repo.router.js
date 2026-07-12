const express = require("express");
const repoController = require("../controllers/repoController");
const s3Controller = require("../controllers/s3Controller");

const repoRouter = express.Router();

repoRouter.get("/repo/s3-list", s3Controller.getS3Repositories);
repoRouter.get("/repo/s3-readme/:repoName", s3Controller.getS3Readme);
repoRouter.get("/repo/s3-files/:repoName", s3Controller.getS3Files);
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoriesForCurrentUser,
);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

module.exports = repoRouter;
