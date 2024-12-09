# CalCenter

A full-stack application designed to help users by tracking caloric intake, exercise routines, and progress over time.

---

## Overview

The **Fitness Tracker App** consists of the following components:
- **Frontend:** Built using React Native, it provides an interface for users to log their activities and caloric intake.
- **Backend:** A RESTful API built with Node.js and Express to handle data operations and authentication.
- **Database:** A MySQL database to store user data, including profiles, activity logs, and nutritional records.

---

## System Requirements

Before setting up the project, ensure you have the following installed:
- **Node.js**
- **npm**
- **Homebrew**
- **MySQL** installed and running w/ configured FitnessTrackDB
- **Expo CLI**

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:Donald-Tan/CalCenterv2.git
cd CalCenterv2
```

### 2. Install Dependencies

#### Frontend:
Navigate to the frontend directory and install dependencies:
```
cd frontend/CalCenterv2
npm install
```

#### Backend:
Navigate to the backend directory and install dependencies:
```
cd backend
npm install
```

Note that these are also run when using the ./start-servers.sh script. This should be run every time the app starts up
to ensure that the proper dependencies are in the package.

### 3. Configure the MySQL Database
1. Ensure MySQL is installed and running:
   ```
   brew services start mysql
   mysql.server start
   ```
2. Create the required database per the included zipped file
3. Configure the backend to connect to the database:
    - Update the `.env` file in the backend directory with your database credentials:
      ```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=<your-password> # Only if you have setup your MySQL server to use a password - otherwise leave it blank
      DB_NAME=FitnessTrackDB
      ```
4. Delete the database.sql.gz from the CalCenter root directory

---

## Using the Scripts

### Start MySQL
To start the MySQL server and the application:
```
./start-mysql.sh
```

This script:
1. Starts the MySQL service.
2. Connects to the `FitnessTrackDB` database.
3. Starts the frontend and backend servers.

### Stop MySQL
To stop the MySQL service and any related processes:
```
./stop-mysql.sh
```

This script:
1. Stops the MySQL server and services.
2. Waits for a few seconds before ensuring all MySQL-related services are stopped.
3. Stops the homebrew MySQL service.

---

## Running the Frontend and Backend Manually

There is an option to run the frontend and backend manually if you choose to do so. The following procedure shows the
correct startup sequence.

### Frontend:
1. Navigate to the `frontend/CalCenterv2` directory:
   ```
   cd frontend/CalCenterv2
   ```
2. Start the app using Expo:
   ```
   npx expo start
   ```

### Backend:
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Start the backend server:
   ```
   npm start
   ```

---

## Git Workflow

### Setting Up a New Branch
1. Pull the latest changes from the main branch:
   ```
   git pull origin main
   ```
2. Create a new branch for your feature:
   ```
   git checkout -b <your-dev-branch>
   ```

### Rebasing with the Latest Changes
Keep your branch up-to-date with the latest changes:
```
git fetch origin
git rebase origin/main
```

### Pushing Your Changes
After committing your work:
```
git push origin <your-dev-branch>
```

---

## Git Commands

| **Command**                    | **Description**                                                 |
|--------------------------------|-----------------------------------------------------------------|
| `git pull origin <branch>`     | Pull the latest changes from the specified branch.              |
| `git checkout <branch>`        | Switch to the specified branch.                                 |
| `git checkout -b <new-branch>` | Create and switch to a new branch.                              |
| `git fetch origin`             | Fetch changes from the remote without merging.                  |
| `git rebase origin/<branch>`   | Rebase your branch onto the latest changes from another branch. |
| `git status`                   | Show the status of your working directory.                      |
| `git add .`                    | Stage all changes for commit.                                   |
| `git commit -m "<message>"`    | Commit staged changes with a message.                           |
| `git push origin <branch>`     | Push changes to the remote branch. Don't push direct to main!   |
| `git reflog`                   | View branch commit history.                                     |
