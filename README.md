# CodeHub 🚀

Welcome to CodeHub. This guide first walks you through using the project commands, followed by a detailed overview of the system architecture and features.

---

## 🛠️ Terminal Commands & Usage Guide

Follow the guides below to run the application components locally and use the custom Version Control System (VCS) CLI.

### 1. Running the Servers (Frontend & Backend)

To start the local environment, run the following commands in separate terminals:

#### **Backend Server Setup**
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run the backend in development mode (starts server on port 3000)
npm run dev
```

#### **Frontend App Setup**
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend dev server (runs Vite)
npm run dev
```
Once the frontend is running, navigate to the URL printed in your terminal (usually `http://localhost:5173`).

---

### 2. Using the `apnaGit` VCS CLI Commands

The project includes a custom git-like VCS tool called **apnaGit** built via a yargs CLI under `backend/index.js`. You run these commands from the directory you want to version-control.

#### **Command Reference**

| Command | Usage | Description |
| :--- | :--- | :--- |
| **Initialize Repo** | `node backend/index.js init` | Initializes a new repository. Creates a local `.apnaGit` directory containing a `commits` folder and a `config.json` file. |
| **Stage File** | `node backend/index.js add <file>` | Adds the specified file to the staging area by copying it to `.apnaGit/staging/`. |
| **Commit Changes** | `node backend/index.js commit <message>` | Commits staged files. Packages them under a unique UUID folder in `.apnaGit/commits/` alongside a `commit.json` metadata file. |
| **Push to S3** | `node backend/index.js push` | Uploads local commits from `.apnaGit/commits/` to your AWS S3 bucket. |
| **Pull from S3** | `node backend/index.js pull` | Pulls all commits from your AWS S3 bucket down to the local `.apnaGit/commits/` directory. |
| **Revert Commit** | `node backend/index.js revert <commitId>` | Reverts your workspace files to the state of the specified `commitId` from `.apnaGit/commits/`. |
| **Help Menu** | `node backend/index.js --help` | Displays the help menu with all available command details. |

---

## 🧬 Project Overview & Explanation

### What is CodeHub?
CodeHub is a full-featured web application platform modeled after GitHub, combined with a custom CLI-based version control system (`apnaGit`). It provides a user interface for users to host repositories, track issues, star public repositories, and view activities, alongside a terminal client that lets users push and pull directory snapshots to AWS S3.

### 📂 Folder Structure
*   **`frontend/`**: The client-side application built using **React (Vite)**, `@primer/react` for GitHub-styled components, and `react-router-dom` for application routing.
*   **`backend/`**: The server-side application containing:
    *   **REST APIs**: Node/Express endpoints for users, repositories, and issues.
    *   **Real-time Server**: Socket.io integration to handle join rooms and sync state.
    *   **`apnaGit` CLI**: The logic and controllers defining the custom CLI repository interactions (`init.js`, `add.js`, `commit.js`, etc.).

### 🧬 Key Features
1. **User Authentication**: Secure Signup, Login, Profile updates, and JWT Token authorization.
2. **Repository Management**: Create, view, update, and delete repositories with public/private visibility toggles.
3. **Issue Tracker**: Create issues, track status (open/closed), and link them to repositories.
4. **Social & Collaboration**: Star public repositories.
5. **Custom Cloud VCS**: Local staging and commit structures coupled with AWS S3 backups.

### ⚙️ Environment Configuration (`backend/.env`)

Configure the backend variables inside `backend/.env` for proper operation:

```env
# AWS Configuration (Used by apnaGit CLI for S3 integration)
AWS_ACCESS_KEYY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region

# Database & Server Configuration
MONGODB_URI=your_mongodb_connection_uri
PORT=3000
JWT_SECRET_KEY=your_jwt_secret_token
```

> [!NOTE]  
> Notice that the AWS Access Key ID env variable is spelled with a double 'Y' (`AWS_ACCESS_KEYY`) due to the project's configuration code.
