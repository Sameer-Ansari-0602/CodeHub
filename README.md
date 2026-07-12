# CodeHub 🚀

CodeHub is a simple, GitHub-inspired repository management platform. It consists of two main parts:
1. **Web Dashboard**: A modern web interface where you can create, explore, and star repositories, featuring a user contribution heatmap.
2. **apnaGit CLI**: A custom-built command-line version control system (like Git) that lets you track files locally and synchronize your snapshots with **AWS S3**.

---

## 💻 apnaGit Custom CLI Commands

The project includes a custom command-line interface helper. You can run all your version control commands directly through Node.js:

* **`init [name]`**: Sets up a new repository. It creates a hidden `.apnaGit/` folder and saves your repository's name. If no name is provided, it defaults to your current directory's name.
* **`add <file>`**: Stages a specific file, copying it to the local `.apnaGit/staging/` area to prepare it for a commit.
* **`commit <message>`**: Creates a local snapshot of all staged files under a unique ID, saving your commit details and timestamp.
* **`push`**: Uploads all your local commits and files securely to your configured AWS S3 bucket.
* **`pull`**: Downloads and restores all committed files for your repository from AWS S3 back into your local directory.
* **`revert <commitId>`**: Restores your local project files back to a previous commit snapshot.

---

## ⚙️ How it Works

1. **Local Tracking**: When you initialize (`init`) and stage files (`add`), `apnaGit` tracks files locally within the hidden `.apnaGit/` directory.
2. **Snapshots**: Committing (`commit`) creates copies of the files inside `.apnaGit/commits/<commit-uuid>/` along with metadata (`commit.json`).
3. **AWS S3 Sync**: When you run `push`, the CLI reads your local commits and uploads them to the AWS S3 bucket. To keep different repositories separate in S3, files are grouped under a unique prefix: `repositories/${repoName}/commits/...`.
4. **Dashboard List**: The web dashboard calls a backend API that scans S3 prefixes. It lists all S3 repositories and parses their committed `README.md` files to display description previews and full README modals.

---

## 🚀 How to Use

### 1. Project Setup
Clone the repository and install dependencies in both the backend and frontend folders:

```bash
# Backend Setup
cd backend
npm install

# Frontend Setup
cd ../frontend
npm install
```

Make sure to configure your environment variables in `backend/.env`:
```env
AWS_ACCESS_KEYY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
PORT=3000
```

### 2. Run the Applications
```bash
# Start backend server (runs on Port 3000)
npm run dev

# Start frontend application (runs on Vite dev server)
cd ../frontend
npm run dev
```

### 3. Use the apnaGit CLI
Run version control commands from the root directory:
```bash
# Initialize your repository
node backend/index.js init my-repo-name

# Stage files
node backend/index.js add README.md

# Commit changes
node backend/index.js commit "Initial commit"

# Push to S3
node backend/index.js push

# Pull from S3
node backend/index.js pull
```

---

## 🌟 Web Dashboard Features

* **Repository Management**: Create and toggle repositories between **Public** and **Private** visibility.
* **Explore Feed**: Search and discover public repositories created by other developers.
* **Starring**: Bookmark/star repositories you like.
* **Contribution Heatmap**: A GitHub-inspired chart on user profiles displaying contribution activity.
* **Modern UI**: Dark-themed, responsive interface matching GitHub aesthetics.
* **Secure Auth**: Secure signup and login powered by JSON Web Tokens (JWT) and bcrypt encryption.
