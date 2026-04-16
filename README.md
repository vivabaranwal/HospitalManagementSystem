# Hospital Management System (HMS)

A professional, full-stack Hospital Management System with a React frontend and a Flask (Python) REST API backend, integrated with Supabase (PostgreSQL).

## Project Structure

This project is organized into two main components:

- **[/frontend](./frontend)**: The user interface built with React, Vite, TypeScript, and Tailwind CSS.
- **[/backend](./backend)**: The REST API and database logic built with Flask and Psycopg3.

## Quick Start

### 1. Automatic Startup (Windows)

Use the provided master script to launch both the backend and frontend simultaneously:

```bash
run START_HMS.bat
```

### 2. Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- **Clinical Dashboard**: Real-time overview of hospital metrics.
- **Patient Management**: Complete CRUD operations for patient registration.
- **Appointment Booking**: Specialist-driven scheduling system.
- **Ward Logistics**: Telemetry-style tracking for bed availability.
- **Staff Directory**: Categorized views for doctors and departments.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TanStack Query, Shadcn UI.
- **Backend**: Flask, Psycopg3, Python Dotenv.
- **Database**: PostgreSQL (Supabase).
- **Styling**: Tailwind CSS with Premium Neon/Glassmorphism design.
