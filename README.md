<div>

Triloop – Real-Time Chat Application

Triloop is a full-stack (mern) real-time chat application with friend management, DM chat rooms, and Trie-based message prediction.

It focuses on clean architecture, real-time communication, and secure APIs.

🚀 Quick Start

Prerequisites

	•	Node.js (v18 or higher)
	•	MongoDB (local or Atlas)
	•	npm


📦 Installation

1 Clone the repository

  • git clone <repository-url>
  • cd triloop_chat_app

2 Install dependencies

  • cd backend
  • npm install

  • cd frontend
  • npm install

⚙️ Environment Variables

Create .env files in both backend and frontend folders.

Backend .env

   MONGODB_URI= your_mongodb_connection_string
   JWT_SECRET= random_secret_key
   PORT=5000
   NODE_ENV=development

 frontend .env

   VITE_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000


▶️ Running the Application

open two terminal tabs differently

Start Backend

cd backend

node server.js or nodemon server.js 
Nodemon is the npm package you can install using npm helps avoid sever restarting repeatedly 

Start Frontend (new terminal)

cd frontend
npm run dev


🔌 Core Features

Authentication

	•	User signup and login
	•	JWT-based authentication
	•	Password hashing using bcrypt
    •   Username availability check with backend-generated suggestions


Friends System

	•	Send, accept, reject, and cancel friend requests
	•	Real-time friend updates via Socket.io
	•	Search users

Chat System

	•	One-to-one (DM) chats
	•	Recent chat tracking
	•	Real-time message delivery

Message Prediction

	•	Trie-based word suggestions
	•	Room-specific and global predictions
	•	Debounced typing (300ms)

⸻

🌐 API Overview

Auth

	•	POST /auth/signup
	•	POST /auth/login

Friends

	•	GET /friends/requests
	•	GET /friends/list
	•	POST /friends/request/:userId
	•	POST /friends/respond/:requestId
	•	POST /friends/cancel/:requestId
	•	GET /friends/search?q=

Messages

	•	GET /messages/recent
	•	GET /messages/:roomId
	•	POST /messages/send
	•	GET /messages/:roomId/predict
	•	POST /messages/room/create

Rooms

	•	POST /rooms/create
	•	GET /rooms

⸻

🔄 Real-Time Socket Events

	•	friend:request-received
	•	friend:request-accepted
	•	friend:request-rejected
	•	friend:request-cancelled
	•	friend:added
	•	receive-message
	•	recent-chat-updated
	•	user-joined

⸻

🛠️ Tech Stack

Frontend

	•	React 18
	•	Redux Toolkit (RTK Query)
	•	Tailwind CSS
	•	React Router DOM
	•	Socket.io Client
	•	Axios
	•	Vite

Backend

	•	Node.js
	•	Express.js
	•	MongoDB + Mongoose
	•	Socket.io
	•	JWT Authentication
	•	bcrypt
	•	Custom Trie implementation

🔒 Security

	•	JWT authentication (Bearer tokens)
	•	bcrypt password hashing
	•	Input validation on all endpoints
	•	NoSQL injection prevention
	•	Rate limiting on prediction endpoint
	•	Sanitized responses
	•	Generic error messages (no sensitive leaks)

✅ Status

	•	Core chat features completed
	•	Real-time messaging working
	•	Trie prediction integrated
	•	Secure and production-ready structure

⚠️ Important Note

Never commit .env files or secrets to the repository.
Always keep environment variables private and listed in .gitignore.

