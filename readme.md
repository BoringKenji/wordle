# Multiplayer Wordle Game

A real-time multiplayer version of the popular word-guessing game Wordle, built with Next.js and Go.

## 🎮 Features

- **Single Player Mode**
  - Classic Wordle gameplay
  - Customizable word lists
  - Adjustable number of attempts
  - Letter status tracking

- **Multiplayer Mode (Coming)** 
  - Create and join game rooms
  - Real-time player interaction
  - Ready-up system
  - Competitive gameplay

- **Game Settings**
  - Custom word lists
  - Adjustable maximum attempts
  - Optional "Host Cheating" mode (Absurdle variant)

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
git clone https://github.com/yourusername/wordle-multiplayer.git
cd wordle-multiplayer
```

2. Start the application:
```
docker-compose up --build
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

1. Try to guess the 5-letter word
2. After each guess, you'll get color-coded feedback:
* 🟩 Green: Letter is correct and in the right position:
* 🟨 Yellow: Letter is in the word but in the wrong position
* ⬜ Gray: Letter is not in the word

Multiplayer Mode
* Create or join a room
* Wait for all players to mark themselves as ready
* Take turns guessing the word
* First player to guess correctly wins!

## 🏗️ Project Structure
```
├── frontend/
    ├── Dockerfile
    ├── README.md
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
    ├── src
        ├── app
        │   ├── favicon.ico
        │   ├── fonts
        │   │   ├── GeistMonoVF.woff
        │   │   └── GeistVF.woff
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.module.css
        │   └── page.tsx
        └── components
            ├── SettingsModal
            │   ├── SettingsModal.css
            │   └── SettingsModal.tsx
            ├── VirtualKeyboard
            │   ├── VirtualKeyboard.css
            │   └── VirtualKeyboard.tsx
            └── WordleGame
                ├── WordleGame.css
                └── WordleGame.tsx
└── backend/
    ├── Dockerfile
    ├── cmd
    │   └── server
    │       └── main.go
    ├── config
    │   └── config.go
    ├── go.mod
    ├── go.sum
    └── internal
        ├── api
        │   ├── handlers
        │   │   ├── game.go
        │   │   └── settings.go
        │   └── routes.go
        ├── game
        │   ├── game.go
        │   └── state.go
        ├── utils
        │   └── helpers.go
        └── wordlist
            └── wordlist.go
```

## 📝 TODO
- [ ] Add user authentication
- [ ] Implement chat system
- [ ] Add game statistics
- [ ] Create leaderboard
- [ ] Add sound effects
- [ ] Implement game history

## Acknowledgments
This is a programming test from Sandbox VR