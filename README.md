# Couch Critic

A movie, TV show and anime discovery app with user accounts, comments and a personal Watch Later list.

**Live site:** https://akansh-gupta.github.io/Couch-Critic/

## Features

- Browse trending, premiering, airing today and upcoming titles for Movies, TV Shows and Anime
- Search each category and filter by genre
- Detail pages with trailer, ratings, cast info, related titles and recommendations
- Login with Auth0 (email/password or Google)
- Profile page with an editable username
- Comments on every title (add, edit, delete)
- Watch Later list saved per account
- Responsive layout for desktop and mobile

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite 7, React Router 6, Bootstrap 5, react-slick |
| Auth | Auth0 (`@auth0/auth0-react`, `express-oauth2-jwt-bearer`) |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas |
| Data source | [Simkl API](https://simkl.docs.apiary.io/) |
| Hosting | GitHub Pages (frontend), Render (backend) |

## Project Structure

```
Couch-Critic/
├── backend/
│   ├── mongodb.js        # MongoDB connection
│   ├── server.js         # Express API
│   └── package.json
├── public/
│   └── 404.html          # SPA redirect for GitHub Pages
├── src/
│   ├── api.js            # Backend base URL
│   ├── components/       # Pages and UI components
│   ├── style/            # CSS files
│   ├── App.jsx           # Routes
│   └── main.jsx          # Auth0 provider and app entry
├── index.html
├── vite.config.mjs
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 22 LTS (Vite 7 requires 20.19+ or 22.12+)
- A MongoDB Atlas cluster
- An Auth0 application and API
- A Simkl API client ID

### 1. Clone and install

```bash
git clone https://github.com/Akansh-Gupta/Couch-Critic.git
cd Couch-Critic
npm install
cd backend
npm install
cd ..
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_SIMKL_CLIENT_ID_1=your_simkl_client_id
```

`VITE_API_URL` is optional. Without it the frontend uses `http://localhost:4000`.

Create `backend/.env`:

```env
MONGO_URL=your_mongodb_atlas_connection_string
```

### 3. Run locally

```bash
npm run dev
```

This starts the frontend (Vite) and the backend (nodemon on port 4000) together. Open the URL printed by Vite, which includes the `/Couch-Critic/` base path.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run frontend and backend together |
| `npm start` | Run the frontend only |
| `npm run build` | Build the frontend into `dist` |
| `npm run preview` | Preview the production build |
| `npm run deploy` | Build and publish `dist` to the `gh-pages` branch |

## API Endpoints

Routes marked with a lock require an Auth0 access token in the `Authorization: Bearer` header.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | | Health check |
| GET | `/protected` | 🔒 | Sync the logged-in user to MongoDB |
| GET | `/users/me` | 🔒 | Get the current user's profile |
| PATCH | `/users/me` | 🔒 | Update the username |
| GET | `/watchlater` | 🔒 | Get the user's Watch Later list |
| POST | `/watchlater` | 🔒 | Add a title |
| DELETE | `/watchlater/:simklId` | 🔒 | Remove a title |
| GET | `/comments/:type/:id` | | Get comments for a title |
| POST | `/comments` | 🔒 | Add a comment |
| PATCH | `/comments/:id` | 🔒 | Edit a comment |
| DELETE | `/comments/:id` | 🔒 | Delete a comment |

## Deployment

### Backend (Render)

1. Create a new **Web Service** from this repo.
2. Set **Root Directory** to `backend`, **Build Command** to `npm install`, and **Start Command** to `node server.js`.
3. Add environment variables: `MONGO_URL` and `NODE_VERSION=22`.
4. In MongoDB Atlas, allow Render's access under **Network Access** (`0.0.0.0/0` on the free tier).
5. Add your frontend origin to the `cors` list in `backend/server.js`.

The free tier sleeps after inactivity, so the first request can take up to a minute.

### Frontend (GitHub Pages)

1. Create `.env.production` in the project root (do not commit it):

   ```env
   VITE_API_URL=https://your-backend.onrender.com
   VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   VITE_SIMKL_CLIENT_ID_1=your_simkl_client_id
   ```

2. Run:

   ```bash
   npm run deploy
   ```

3. In the repo, go to **Settings → Pages** and set the source to the `gh-pages` branch, `/ (root)`.

Vite reads `VITE_*` variables at build time, so rebuild and redeploy after changing them.

### Auth0 settings

In your Auth0 application settings, add:

- **Allowed Callback URLs:** `https://akansh-gupta.github.io/Couch-Critic/callback`, `http://localhost:5173/Couch-Critic/callback`
- **Allowed Logout URLs:** `https://akansh-gupta.github.io/Couch-Critic/movie`, `http://localhost:5173/Couch-Critic/movie`
- **Allowed Web Origins** and **Allowed Origins (CORS):** `https://akansh-gupta.github.io`, `http://localhost:5173`

For production, replace Auth0's development keys for the Google connection with your own Google OAuth client ID and secret.

## Notes

- Routing uses the `/Couch-Critic/` base path. `public/404.html` and the script in `index.html` redirect deep links on GitHub Pages.
- Watch Later items are stored in the `watchlater` collection, keyed by the Auth0 user ID, so each account has its own list.
- The Simkl client ID is embedded in the frontend bundle, as with any client-side API key.

## License

This project is for learning and personal use.
