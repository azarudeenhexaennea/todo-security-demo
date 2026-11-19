# Todo Security Pipeline Demo

A small React + Vite frontend and Node.js/Express backend using SQLite as a local database. It is intended as a safe demo repository for learning GitHub Actions security scanning.

## Requirements
- Node.js 20+
- npm

## Run locally

Open two terminals:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` requests to Express at `http://localhost:4000`.

SQLite database is created automatically at `server/data/todos.db` when the API starts. It is intentionally excluded from Git.

## Tests and builds

```bash
cd server && npm install && npm test
cd ../client && npm install && npm run build
```

## GitHub Actions

The workflow at `.github/workflows/security-ci.yml` runs on pushes and pull requests:
- frontend and backend tests/build
- Semgrep SAST
- OSV-Scanner dependency scan
- Gitleaks secret scan
- Trivy filesystem scan

It does not deploy anything. The initial workflow reports scanner findings as artifacts and does not fail the whole pipeline for vulnerability findings, so you can establish a baseline. Build and test failures still fail CI. Once the baseline is reviewed, tighten the scanner gates.

## Push to a new GitHub repository

Create an empty GitHub repository, then from this directory:

```bash
git init
git add .
git commit -m "Initial React Node SQLite todo security demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Do not commit `.env`, database files, credentials, or generated `node_modules`.
