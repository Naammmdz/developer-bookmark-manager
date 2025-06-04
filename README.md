# Developer Bookmark Manager

Developer Bookmark Manager is a web application that helps developers organize, store, and share programming resources such as documentation, tutorials, tools, and code examples efficiently.

## 🌟 Key Features

- **Bookmark management:** Add, edit, delete, categorize, and mark favorite resources
- **Smart Tagging:** Suggestions and auto-complete based on content and user habits
- **Search & Filter:** Search bookmarks by keyword, tag, collection, etc.
- **Collections/Folders:** Organize bookmarks by folder or topic
- **Sharing:** Share bookmarks or collections (public/private)
- **Team collaboration:** Manage, assign roles, and share resources with teams
- **Browser Import:** Import bookmarks from browser export files
- **Developer-friendly UI:** Dark mode, responsive design, keyboard shortcuts

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Tailwind CSS
- **Backend:** Spring Boot 3.x (Java 17+), Spring Security (JWT), Spring Data JPA, PostgreSQL
- **CI/CD:** GitHub Actions, Docker, docker-compose

## 🚀 Project Structure

```
developer-bookmark-manager/
├── backend/           # Spring Boot API
├── frontend/          # React app
├── docs/              # Project documentation
├── docker-compose.yml # Local dev environment
├── .github/           # CI/CD workflows
├── README.md
└── .gitignore
```

## 📦 Getting Started

### 1. Clone the project
```sh
git clone https://github.com/<your-org>/developer-bookmark-manager.git
cd developer-bookmark-manager
```

### 2. Run locally with Docker
```sh
docker-compose up --build
```
- API: http://localhost:8080
- Frontend: http://localhost:3000

### 3. Configure environment variables
Create a `.env` file based on `.env.example` in backend & frontend if you need custom configuration.

## 🧑‍💻 Contributing

1. Fork the repo and create a `feature/your-feature` branch
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
3. Open a Pull Request with a clear description
4. See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

---
> _Made with ❤️ by the developer community_