# Multiplayer Wordle Game

A programming assignment implementation of Wordle game with various modes, built with Next.js and Go.

## 🎮 Features

### Task 1: Normal Wordle ✅
- Classic Wordle gameplay based on NYTimes Wordle
- Configurable settings:
  - Maximum number of attempts
  - Customizable word lists (5-letter English words only)
- Clear win/lose conditions
- Case-insensitive input

### Task 2: Server/Client Wordle ✅
- Complete separation of game logic between client and server
- Secure answer handling (answer unknown to client until game over)
- Server-side input validation
- RESTful API implementation

### Task 3: Host Cheating Mode (Absurdle) ✅
- Dynamic answer selection based on player guesses
- Scoring system:
  - Prioritizes fewer exact matches (Hits)
  - Secondary priority on partial matches (Present)
- Indistinguishable from normal mode from player perspective

### Task 4: Multiplayer Mode (In Progress) 🚧 (Coming soon)
- Room creation and joining system
- Player ready-up mechanism
- Real-time game state updates
- Clear win/lose/tie conditions

## 🚀 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Emotion](https://emotion.sh/) - Styled components
- [Axios](https://axios-http.com/) - HTTP client

### Backend
- [Go](https://golang.org/) - Backend language
- [Gin](https://gin-gonic.com/) - Web framework
- [Docker](https://www.docker.com/) - Containerization

## 🛠️ Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Go (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/BoringKenji/wordle-multiplayer.git
cd wordle-multiplayer
```

2. Start the application:
```
docker compose up --build
```

The application will be available at:

Frontend: http://localhost:3000
Backend: http://localhost:8080

### Local Development
Start the backend:
```
cd backend
go mod download
go run cmd/server/main.go
```
Start the frontend::
```
cd frontend
npm install
npm run dev
```

## 🎯 Game Rules

### Scoring Rules
- Hit (🟩): Letter is in the correct spot
- Present (🟨): Letter is in the word but wrong spot
- Miss (⬜): Letter is not in the word

### Host Cheating Mode (Absurdle)
The game maintains a list of candidate words and updates it based on:
- Lowest possible score for current guess
- Consistency with previous round results


## 📝 High Priority TODOs

Security and Configuration:
- [ ] Add CORS restrictions to backend API
- [ ] Move frontend configuration to separate files
- [ ] Implement proper error handling and logging
- [ ] Implement request validation middleware

Features and Improvements:
- [ ] Complete multiplayer mode implementation
- [ ] Add game statistics tracking
- [ ] Implement proper game state management
- [ ] Add unit tests for both frontend and backend
- [ ] Add integration tests for API endpoints

User Experience:
- [ ] Add loading states and error messages
- [ ] Implement responsive design for mobile devices
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility

Documentation:
- [ ] Add API documentation
- [ ] Document game logic and scoring system
- [ ] Add development setup guide
- [ ] Document testing procedures

## Trade-offs and Decisions

1. Technology Choices:
   - Next.js: Provides good developer experience and built-in optimizations
   - Go: Excellent performance for backend services and good standard library
   - REST over WebSocket: Simpler implementation for current requirements

2. Architecture Decisions:
   - Separate frontend/backend: Allows independent scaling and maintenance
   - Docker deployment: Ensures consistent environment across development and production

3. Future Considerations:
   - WebSocket implementation for real-time features
   - Database integration for persistent storage
   - Authentication system for user management

## 🙏 Acknowledgments

This project is a programming assignment from Sandbox VR. Special thanks for providing this detailed and interesting challenge that covers various aspects of software development including:
- Understanding of abstract problems
- Decision making based on requirements
- Code quality and organization
- Documentation
- Source code repository practices

Special appreciation for the opportunity to demonstrate skills in both frontend and backend development, as well as system design considerations.

---

Made with ❤️ by Kenji
