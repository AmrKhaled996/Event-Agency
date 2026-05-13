# Fa3liat — Web Dashboard (Frontend) 💻

This is the frontend component of the Fa3liat platform, built with **React 19**, **Vite**, and **Tailwind CSS 4**. It provides a responsive interface for attendees to discover events and for organizers to manage their events and tickets.

## 🚀 Getting Started

### 1. Manual Setup (Development)

To run the frontend individually in development mode:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file based on `.env.example`:
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The dashboard will be available at [http://localhost:5173](http://localhost:5173).

---

### 2. Docker Setup (Recommended)

When running via the root `docker-compose.yml`, the frontend is automatically built and served via **Nginx**.

- **Internal Proxy:** Nginx is configured as a reverse proxy. It automatically forwards all requests starting with `/api/` to the backend container.
- **Port:** The Docker container exposes port `5173`.

To start only the frontend and backend via Docker:
```bash
docker compose up --build frontend backend
```

---

## 🛠 Tech Stack

- **React 19**: Latest features and performance.
- **Vite**: Ultra-fast build tool.
- **Tailwind CSS 4**: Modern utility-first styling.
- **Material UI / Radix**: For accessible and polished UI components.
- **Framer Motion**: Smooth animations and transitions.

## 📂 Project Structure

- `src/components/`: Reusable UI elements.
- `src/pages/`: Main route components (Home, Events, Dashboard).
- `src/hooks/`: Custom React hooks for state and logic.
- `src/services/`: API integration layer.
- `src/context/`: Global state management.

---
**Fa3liat Frontend** — Part of the Graduation Project 2026.
