# Hospital Management System

A modern full-stack application for managing hospital records, patients, doctors, and appointments.

## Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State/Query:** Tanstack Query (React Query)

### Backend
- **Framework:** Flask (Python)
- **Database Driver:** Psycopg2
- **Database:** PostgreSQL (Supabase)

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- A Supabase account (or any PostgreSQL database)

### 2. Database Setup
Ensure your database has the following tables:
- `patients` (id, name, age, gender, phone, department, status, doctor_name)
- `doctors` (id, name, specialty, experience, status)
- `appointments` (id, patient_name, doctor_name, department, date, time, type, status)
- `wards` (id, name, total_beds, occupied_beds, type)

### 3. Backend Setup
Navigate to the backend folder:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env