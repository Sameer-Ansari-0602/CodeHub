# CodeHub 🚀

> **CodeHub** is a GitHub-inspired repository management platform built with the MERN stack. It enables users to create and manage repositories through a modern web interface while featuring **apnaGit**, a custom-built command-line version control system that stores project snapshots in **AWS S3**.

🌐 **Live Demo:** https://code-hub-app.vercel.app/

---

# 🌟 Highlights

- 💻 Developed a **custom command-line version control system (apnaGit)** from scratch using **Node.js** and **Yargs**
- ⚡ Implemented custom terminal commands: **`init`**, **`add`**, **`commit`**, **`push`**, **`pull`**, and **`revert`**
- ☁️ Integrated **AWS S3** for storing and retrieving commit snapshots
- 🔐 Implemented secure authentication using **JWT** and **bcrypt**
- 📁 Built a GitHub-inspired repository management platform
- ⭐ Users can create **public/private repositories** and star repositories
- 📊 Designed a GitHub-style **Recent Contributions** heatmap for user profiles
- ⚛️ Built a responsive frontend using **React**, **Vite**, and **Primer React**

---

# 📖 About the Project

CodeHub is a GitHub-inspired repository management platform that allows users to securely create and manage repositories through a familiar developer interface.

Alongside the web application, the project includes **apnaGit**, a custom version control system built from scratch using **Node.js**. The CLI provides its own terminal commands for initializing repositories, staging files, creating snapshot-based commits, synchronizing project snapshots with AWS S3, and restoring previous project versions.

The web application manages repository metadata, authentication, and user interactions, while **AWS S3** stores project snapshots uploaded through the CLI.

---

# ✨ Features

## 🌐 Web Application

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 🔒 Password Encryption using bcrypt
- 📁 Create Public & Private Repositories
- 👤 User Profile Page
- ⭐ Star Repositories
- 📂 View Personal Repositories
- 🌍 Explore Repositories
- 📊 GitHub-inspired Recent Contributions Heatmap
- 🎨 Responsive GitHub-inspired UI

---

## 💻 apnaGit (Custom CLI)

Built using **Node.js**, **Yargs**, and the **Node.js File System API**.

### Supported Commands

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `init`              | Initialize a local repository         |
| `add <file>`        | Stage a file                          |
| `commit <message>`  | Create a snapshot-based commit        |
| `push`              | Upload commit snapshots to AWS S3     |
| `pull`              | Download commit snapshots from AWS S3 |
| `revert <commitId>` | Restore a previous project snapshot   |
| `--help`            | Display all available commands        |

### CLI Features

- 🖥️ Custom terminal commands
- 📁 Local repository initialization
- 📦 File staging
- 📝 Snapshot-based commits
- ☁️ AWS S3 synchronization
- 🔄 Restore previous project versions
- 📂 Local commit history management

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- Primer React

## Backend

- Node.js
- Express.js
- JWT
- bcrypt
- Yargs
- Node.js File System API

## Database

- MongoDB
- Mongoose

## Cloud

- AWS S3

---

# 🏗️ Project Architecture

```text
                    React Frontend
                           │
                    Axios + JWT
                           │
                    Express Backend
                           │
                       MongoDB
          (Users & Repository Metadata)
                           │
        ─────────────────────────────────
                           │
                     apnaGit CLI
                           │
                 Local File System
                           │
                     AWS S3 Bucket
                  (Commit Snapshots)
```

---

# 📂 Project Structure

```
CodeHub
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── apnaGit/
│   └── index.js
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/your-username/CodeHub.git
cd CodeHub
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

# 💻 Using apnaGit

Run these commands from the project directory you want to version control.

### Initialize Repository

```bash
node backend/index.js init
```

Creates a hidden `.apnaGit` directory.

---

### Stage a File

```bash
node backend/index.js add <filename>
```

Example:

```bash
node backend/index.js add index.js
```

---

### Commit Files

```bash
node backend/index.js commit "Initial Commit"
```

Creates a snapshot of all staged files.

---

### Upload Commits to AWS S3

```bash
node backend/index.js push
```

Uploads all commit snapshots to your configured AWS S3 bucket.

---

### Download Commits

```bash
node backend/index.js pull
```

Downloads commit snapshots from AWS S3.

---

### Restore Previous Snapshot

```bash
node backend/index.js revert <commitId>
```

Restores the project to the specified commit snapshot.

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend** directory.

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

PORT=3000

AWS_ACCESS_KEYY=your_aws_access_key

AWS_SECRET_ACCESS_KEY=your_aws_secret_key

AWS_REGION=your_aws_region

AWS_BUCKET_NAME=your_bucket_name
```

> **Note:** The project currently uses `AWS_ACCESS_KEYY` (double **Y**) because it matches the existing implementation.

---

# 📸 Screenshots

### Dashboard

_Add Dashboard Screenshot_

---

### User Profile

_Add Profile Screenshot_

---

### Repository Creation

_Add Repository Creation Screenshot_

---

# 🔮 Future Improvements

- Connect web repositories directly with uploaded S3 snapshots
- Display commit history inside the web application
- Browse repository files through the web interface
- Support repository cloning using apnaGit
- Branch management
- Merge functionality
- Repository search enhancements

---

# 📚 Learning Outcomes

Through this project, I gained hands-on experience with:

- Building REST APIs using Express.js
- Implementing JWT authentication and authorization
- Secure password hashing with bcrypt
- MongoDB schema design using Mongoose
- Developing a custom command-line application using Yargs
- Working with the Node.js File System API
- Integrating AWS S3 for cloud storage
- Building responsive user interfaces with React
- Designing a GitHub-inspired developer platform

---

# 🙌 Acknowledgements

The UI design is inspired by GitHub to provide a familiar developer experience. This project was built for learning purposes to explore full-stack development, custom CLI development, and cloud storage integration.

---

## ⭐ If you found this project interesting, consider giving it a star!
