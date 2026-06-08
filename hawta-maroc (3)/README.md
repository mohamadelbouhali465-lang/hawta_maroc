
**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file and set `MONGODB_URI` to your MongoDB connection string:
   `MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/database`
3. Optional: set `GEMINI_API_KEY` in `.env` if you use Gemini features.
4. Run the full app:
   `npm run dev`

To run only the backend API without Vite:
`npm run dev:backend`

Backend health check:
`http://localhost:3000/api/health`

## MongoDB documents

Use a local database for this project:

`MONGODB_URI=mongodb://127.0.0.1:27017/hawta_maroc`

The app creates these collections automatically when data is saved:

- `deals` - products/offers shown on the deals pages.
- `users` - local demo accounts, profile data, favorites, and notification preferences.
- `requests` - quote requests from the home page.
- `activities` - simple audit records for support, security, campaign, and payment actions.
- `orders` - buy requests created from the Compare page.

Useful API routes:

- `GET /api/deals`
- `POST /api/deals`
- `PUT /api/deals/:id`
- `DELETE /api/deals/:id`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `POST /api/auth/login`
- `GET /api/requests`
- `POST /api/requests`
- `GET /api/activities`
- `POST /api/activities`
- `GET /api/orders`
- `POST /api/orders`

Notes:

- Sign-in is a local development flow. Enter any email and password to create a user document.
- Passwords are stored plainly right now for local testing only. Add hashing and real authentication before production.
- Google, Facebook, payments, email reset, and file upload need external service credentials before they can be production features.
