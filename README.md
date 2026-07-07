# CodeHub 🚀

CodeHub is a full-featured web-based platform (similar to GitHub) coupled with a custom Command Line Interface (CLI) version control system called **apnaGit**. 

It allows users to manage code repositories, create/track issues, star repositories, and synchronize code commits with AWS S3 via a custom CLI tool.

---

## 📂 Project Structure

The project is split into two main directories:

*   **`frontend/`**: The web application user interface built using **React (Vite)**, `@primer/react`, and `react-router-dom`. It communicates with the backend APIs to manage accounts, repositories, and issues.
*   **`backend/`**: The REST API server and CLI tool. Built using **Node.js, Express, MongoDB (Mongoose)**, and **Socket.io** for real-time room communication. It integrates with **AWS S3** to store repository commits.

---

## ⚙️ Configuration Setup

Before running the project, configure your environment variables.

Create a `.env` file in the `backend/` directory:

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

---

## 🛠️ How to Run the Application

Follow these steps to run both the frontend and backend locally:

### 1. Start the Backend Server

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run the backend in development mode (starts server on port 3000)
npm run dev
```

### 2. Start the Frontend App

```bash
# Open a new terminal window, then navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend dev server (runs Vite)
npm run dev
```

Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 💻 How to Use the `apnaGit` CLI Commands

The backend includes a custom version control system called `apnaGit` implemented via yargs CLI in `backend/index.js`. 

You run these commands inside the directory you wish to track.

### Command Reference

| Command | Usage | Description |
| :--- | :--- | :--- |
| **Initialize Repo** | `node backend/index.js init` | Initializes a new repository. Creates a hidden `.apnaGit` directory with a `commits` folder and a `config.json` file. |
| **Stage File** | `node backend/index.js add <file>` | Adds the specified file to the staging area by copying it to `.apnaGit/staging/`. |
| **Commit Changes** | `node backend/index.js commit <message>` | Commits all staged files. Packages them in a unique UUID directory inside `.apnaGit/commits/` with commit metadata. |
| **Push to S3** | `node backend/index.js push` | Uploads all local commits from `.apnaGit/commits/` to AWS S3. |
| **Pull from S3** | `node backend/index.js pull` | Pulls down all commits from the S3 bucket into the local `.apnaGit/commits/` folder. |
| **Revert Commit** | `node backend/index.js revert <commitId>` | Reverts the workspace directory to the state of the specified `commitId` by restoring its files. |
| **Help Menu** | `node backend/index.js --help` | Displays the help menu with all available command details. |

---

## 🧬 Key Features

1. **User Authentication**: Secure Signup, Login, Profile updates, and JWT Token verification.
2. **Repository Management**: Create, view, update, and delete repositories with public/private visibility toggles.
3. **Issue Tracker**: Create issues, track status, and link issues to specific repositories.
4. **Social & Collaboration**: Users can star repositories to show appreciation.
5. **Custom VCS CLI (`apnaGit`)**: Local file staging and version snapshotting, combined with cloud backup to AWS S3.
