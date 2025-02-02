# Task Manager - A Firebase-Powered Task Management Application


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributors](#contributors)


---

## Introduction

Task Manager is a modern, responsive web application built with **React** and **Firebase**. This application allows users to manage their tasks efficiently. It provides a clean and intuitive interface for creating, updating, and deleting tasks, with real-time synchronization to Firebase Firestore. The application also includes features like task prioritization, overdue task highlighting, search, and task changes log.

---

## Features

### Core Features
- **Task Management (CRUD Operations):**
  - Create new tasks with title, description, priority, and due date.
  - Update existing tasks.
  - Delete tasks with confirmation.
- **Real-Time Updates:**
  - Tasks are synchronized in real-time using Firebase Firestore.
- **Overdue Task Indicator:**
  - Automatically marks tasks as overdue if the due date has passed.
  - Highlights overdue tasks with a red background.
- **Task Sorting:**
  - Sort tasks by priority (Low, Medium, High), due date (ascending/descending), or both together.
- **Task Completion:**
  - Mark tasks as completed.
  - Completed tasks are visually indicated with a strikethrough.
- **Responsive Design:**
  - Works seamlessly on desktop, tablet, and mobile devices.

### Bonus Features (Optional)
- **Search Functionality:**
  - Filter tasks by title or description using a search bar.
- **Pagination:**
  - Display tasks in paginated lists with configurable items per page.
- **Task History:**
  - Keep a log of changes made to tasks (e.g., edited title, changed due date).

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Icons**: For adding icons to the UI.

### Backend
- **Firebase Firestore**: A NoSQL cloud database for real-time data synchronization.


### Development Tools
- **Vite**: A fast build tool for modern web applications.
- **ESLint**: For code linting and maintaining code quality.
- **Prettier**: For code formatting.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Firebase account (for Firestore)

### Steps to Run the Project

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/IslamMasry/Task-List.git
   cd task-manager
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (optional).
   - Add your Firebase configuration in `src/lib/firebase.ts`:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Project Structure

```
📦 TASK-LIST
├── 📂 node_modules/          # Installed dependencies (not included in Git)
├── 📂 src/                   # Source code directory
│   ├── 📂 components/        # UI components
│   │   ├── 📄 TaskEditModal.tsx  # Form for editing tasks
│   │   ├── 📄 TaskForm.tsx       # Form for adding tasks
│   │   ├── 📄 TaskList.tsx       # Component to display and manage tasks
│   ├── 📂 lib/               # Library and helper functions
│   │   ├── 📄 firebase.ts    # Firebase configuration
│   ├── 📂 types/             # TypeScript type definitions
│   │   ├── 📄 task.ts        # Task priority levels
│   ├── 📄 App.tsx            # Main application component
│   ├── 📄 index.css          # Global styles
│   ├── 📄 main.tsx           # Application entry point
│   ├── 📄 vite-env.d.ts      # TypeScript environment settings
├── 📄 .gitignore             # Git ignore file
├── 📄 eslint.config.js       # ESLint configuration
├── 📄 index.html             # Main HTML file
├── 📄 package.json           # Project dependencies and scripts
├── 📄 package-lock.json      # Lockfile for dependencies
├── 📄 postcss.config.js      # PostCSS configuration
├── 📄 README.md              # Project documentation
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 tsconfig.app.json      # TypeScript configuration (App)
├── 📄 tsconfig.json          # TypeScript configuration (General)
├── 📄 tsconfig.node.json     # TypeScript configuration (Node)
├── 📄 vite.config.ts         # Vite configuration file

```

---

## Usage

1. **Adding a Task:**
   - In the left side of the screen, fill in the task details (title, description, priority, due date).
   - Click "Create Task" to save the task.

2. **Editing a Task:**
   - Click the edit icon (pencil) next to the task you want to edit.
   - Update the task details and click "Save Changes".

3. **Deleting a Task:**
   - Click the delete icon (trash) next to the task you want to delete.
   - Confirm the deletion in the dialog.

4. **Marking a Task as Completed:**
   - Click the checkbox (clock icon) in the status column to mark it as completed.

5. **Sorting Tasks:**
   - Use the sorting options to sort tasks by priority or due date.
   - Select if you want a secondary sort from the options in the next list.

6. **Searching Tasks:**
   - Use the search bar to filter tasks by title or description.

7. **Task Changes Log:**
   - To view the change history of the task, click the edit icon next to the task, this will show the task edit modal.
   - To the right of the heading bar of the modal, there is a clock icon, click to show change history.
   
---

## Contributors

[Islam Elmasry](#Islam-Elmasry) - Software Engineer

- **Email**: dr.egy2009@hotmail.com
- **GitHub**: [IslamMasry](https://github.com/IslamMasry)

---

Thank you for checking out!