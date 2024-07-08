# MERN Chat Application

A real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io.

## Features

- Real-time messaging
- Private chats
- Responsive design

## Technologies Used

- **Frontend**: React, Socket.io-client, CSS
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB, Mongoose
- **Deployment**: Render

## Installation

### Prerequisites

- Node.js and npm
- MongoDB

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Coder-Madaan/chat-app
   cd mern-chat-app
   ```
2. Install backend dependencies:
    ```bash
   npm install
   ```
3. Create a .env file
   ```bash
   MONGO_URL=<Your MongoDB connection string>
   PORT=5000
    ```
4. Start the backend server:
    ```bash
    npm run start
    ```
### Frontend Setup
1. Install frontend dependencies:
  ```bash
    cd ../public
    npm install

  ```
2. Start the frontend development server:
   ```bash
    npm start

   ```

### Running the Application
1. Ensure both the backend and frontend servers are running.
2. Open your browser and navigate to http://localhost:3000 to use the chat application.
