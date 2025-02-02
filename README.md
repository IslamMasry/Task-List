# Task Management Application

A modern task management application built with React, Firebase, and Tailwind CSS.

## Features

- Create, read, update, and delete tasks
- Set task priority (Low, Medium, High)
- Set due dates for tasks
- Mark tasks as completed
- Automatic overdue task detection
- Sort tasks by priority or due date
- Search functionality
- Responsive design
- Real-time updates using Firebase

## Tech Stack

- React
- TypeScript
- Firebase (Firestore)
- Tailwind CSS
- date-fns
- react-hot-toast
- Lucide React icons

## Project Structure

```
src/
├── components/        # React components
│   ├── TaskForm.tsx  # Form for creating tasks
│   └── TaskList.tsx  # List of tasks with sorting and filtering
├── lib/
│   └── firebase.ts   # Firebase configuration
├── types/
│   └── task.ts       # TypeScript interfaces and types
└── App.tsx           # Main application component
```

## Setup Instructions

1. Clone the repository
2. Create a Firebase project and get your configuration
3. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Set up Firestore security rules
4. Add your web app to Firebase project
5. Copy the configuration to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request