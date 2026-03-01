# Phase 6: Authentication and Admin Enforcement

## Environment Variables
- `AUTH_DEV_LOGIN`: Toggles `/auth/dev-login` endpoint
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: Secrets for signing JWT cookies
- `BCRYPT_ROUNDS`: Int salt rounds for password hashes
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: Google OAuth credentials
- `ADMIN_EMAILS`: Comma-separated allowlist of admin emails
- `ADMIN_PANEL_ENABLED`: Toggles the `/admin` AdminJS UI
- `ADMIN_PANEL_EMAIL`, `ADMIN_PANEL_PASSWORD`: Basic auth credentials for `/admin`
- `ADMIN_COOKIE_PASSWORD`: Secret for AdminJS session cookie `adminjs`

## Cookie Mechanics
Authentications are maintained strictly through `HttpOnly`, `SameSite=Lax` cookies to prevent XSS. 
- `ps_access`: Short-lived JWT (e.g. 15m).
- `ps_refresh`: Long-lived JWT (e.g. 7d) used solely at `/auth/refresh` to rotate tokens.

## Endpoints List
- `POST /auth/dev-login`: Bootstrap login for DEV testing.
- `POST /auth/register`: Create account with email & password.
- `POST /auth/login`: Authenticate with email & password.
- `POST /auth/refresh`: Use `ps_refresh` cookie to rotate sessions.
- `GET /auth/google`: Trigger Google OAuth 2.0 flow.
- `GET /auth/google/callback`: Map Google profile, upsert user, and Set-Cookie.
- `GET /auth/me`: Resolve profile using `ps_access`.
- `POST /auth/logout`: Clear cookies and kill session.

## Admin Enforcement
- **API Roles**: The `ADMIN_EMAILS` env list determines whether a user acquires `role="admin"` upon login. The `AdminRoleGuard` leverages `ps_access` JWT to enforce admin-only restrictions on endpoints like `POST /packs`, `POST /packs/:id/items`, and `POST /jobs/ingest-pack/:id`.
- **AdminJS UI**: Managed completely separately under `/admin`, protected via `ADMIN_PANEL_EMAIL` & `ADMIN_PANEL_PASSWORD` to isolate DB-management UI from standard backend RBAC.

## Testing Locally (CURL snippets)
*Run with `npm run start:dev` and replace placeholder inputs/passwords as necessary.*

### Standard Auth
```sh
# Register
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\",\"password\":\"TestPass123!\",\"name\":\"User\"}"

# Login
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user@test.com\",\"password\":\"TestPass123!\"}"

# Me
curl -i -c cookies.txt -b cookies.txt http://localhost:4000/auth/me

# Refresh
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/refresh

# Logout
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/logout
```
