# Phase 1 Local Development Guide

## Prerequisites
- Node.js 20+
- Git

## Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Preview production build:
```bash
npm run build
npm run preview
```

## Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
Health check:
```bash
curl http://localhost:4000/health
```

## Environment Variables
Copy `.env.example` to `.env` in the root of the project. Do NOT commit the `.env` file!
```bash
cp .env.example .env
```
