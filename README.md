# ChatBot AI 🤖

A full-stack AI chatbot powered by Google Gemini, built with React, Node.js, and Express.

## Features

- AI-powered conversations using Google Gemini
- Multi-turn conversation memory
- Multiple chat sessions
- Persistent chat history using localStorage
- Create and delete conversations
- Markdown and code block formatting
- Animated typing indicator
- Automatic scrolling to latest messages
- Responsive design for desktop and mobile
- Dark-themed user interface

## Tech Stack

**Frontend**
- React.js
- Vite
- CSS3
- React Markdown

**Backend**
- Node.js
- Express.js
- Google Gemini API

**Storage**
- Browser localStorage

## Project Structure

ChatBotAI/
├── client/       # React frontend
├── server/       # Express backend
├── .gitignore
└── README.md

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/sdharr/ChatBotAI.git

cd ChatBotAI

### 2. Backend Setup

cd server

npm install

Create a .env file inside the server folder:

GEMINI_API_KEY=your_gemini_api_key

Start the backend:

node index.js

Backend runs at http://localhost:5000

### 3. Frontend Setup

Open another terminal:

cd client

npm install

npm run dev

Open http://localhost:5173

## How It Works

1. Users enter messages through the React interface.
2. The Express backend receives the requests.
3. The backend securely communicates with Google Gemini.
4. Gemini generates AI responses.
5. Responses are displayed in the chat interface.
6. Conversations are saved in browser localStorage.

## Important Notes

- No user login or database is required.
- Chat history is stored locally in the browser.
- The application sends recent conversation messages to Gemini to provide contextual responses.
- A Gemini API key is required to run the backend.
- The API key is stored in .env and is never committed to GitHub.
- This project is designed to run locally and is not currently deployed.

## Author

Developed as a full-stack AI chatbot portfolio project.