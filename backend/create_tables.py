"""
run once to create all HMS tables + seed demo data in Supabase.
Usage: python create_tables.py
"""
import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

SQL = """
-- ── TABLES ────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS inventory, billing, admissions, appointments, wards, doctors, patients, departments CASCADE;

CREATE TABLE IF NOT EXISTS departments (
    department_id   SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location        VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS patients (
    patient_id        SERIAL PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    age               INT,
    gender            VARCHAR(20),
    contact           VARCHAR(20),
    address           TEXT,
    blood_group       VARCHAR(5),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    doctor_id      SERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone          VARCHAR(20),
    email          VARCHAR(100),
    department_id  INT REFERENCES departments(department_id),
    status         VARCHAR(20) DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS wards (
    ward_id        SERIAL PRIMARY KEY,
    ward_name      VARCHAR(100) NOT NULL,
    ward_type      VARCHAR(50),
    capacity       INT NOT NULL,
    available_beds INT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id   SERIAL PRIMARY KEY,
    patient_id       INT REFERENCES patients(patient_id),
    doctor_id        INT REFERENCES doctors(doctor_id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status           VARCHAR(20) DEFAULT 'Pending',
    type             VARCHAR(50) DEFAULT 'Consultation'
);

CREATE TABLE IF NOT EXISTS admissions (
    admission_id   SERIAL PRIMARY KEY,
    patient_id     INT REFERENCES patients(patient_id),
    ward_id        INT REFERENCES wards(ward_id),
    admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMP,
    status         VARCHAR(20) DEFAULT 'Admitted'
);

CREATE TABLE IF NOT EXISTS billing (
    bill_id      SERIAL PRIMARY KEY,
    patient_id   INT REFERENCES patients(patient_id),
    amount       DECIMAL(10, 2) NOT NULL,
    billing_date DATE DEFAULT CURRENT_DATE,
    status       VARCHAR(20) DEFAULT 'Unpaid'
);

CREATE TABLE IF NOT EXISTS inventory (
    item_id   SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity  INT DEFAULT 0,
    category  VARCHAR(50),
    status    VARCHAR(20) DEFAULT 'In Stock'
);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────

INSERT INTO departments (department_name, location) VALUES
  ('Cardiology',   'Block A, Floor 3'),
  ('Neurology',    'Block B, Floor 2'),
  ('Pediatrics',   'Block C, Floor 1'),
  ('Orthopedics',  'Block D, Floor 2'),
  ('Oncology',     'Block E, Floor 4')
ON CONFLICT DO NOTHING;

INSERT INTO patients (name, age, gender, contact, blood_group, address) VALUES
  ('Sarah Jenkins',  34, 'Female', '+91 98765 00001', 'O+',  '12 Oak Street, Delhi'),
  ('Robert Chen',    52, 'Male',   '+91 98765 00002', 'A-',  '84 Maple Ave, Mumbai'),
  ('Priya Sharma',   28, 'Female', '+91 98765 00003', 'B+',  '7 Elm Road, Bangalore'),
  ('Arjun Nair',     45, 'Male',   '+91 98765 00004', 'AB+', '22 Pine Lane, Chennai'),
  ('Meera Kapoor',   31, 'Female', '+91 98765 00005', 'O-',  '5 Cedar Ave, Hyderabad')
ON CONFLICT DO NOTHING;

INSERT INTO doctors (name, specialization, department_id, status, email, phone) VALUES
  ('Dr. Alice Smith',   'Cardiologist',     1, 'Available',  'alice.smith@hms.com',  '+91 99001 00001'),
  ('Dr. Gregory House', 'Neurologist',      2, 'In Surgery', 'g.house@hms.com',      '+91 99001 00002'),
  ('Dr. Arun Kumar',    'Pediatrician',     3, 'Available',  'arun.kumar@hms.com',   '+91 99001 00003'),
  ('Dr. Prerna Singh',  'Orthopedic Surgeon',4,'On Leave',   'prerna.singh@hms.com', '+91 99001 00004')
ON CONFLICT DO NOTHING;

INSERT INTO wards (ward_name, ward_type, capacity, available_beds) VALUES
  ('General Ward A',   'General',   30, 12),
  ('ICU Alpha',        'ICU',       10,  3),
  ('Pediatric Wing',   'Pediatric', 20,  8),
  ('Maternity Suite',  'Maternity', 15,  5),
  ('Private Suites',   'Private',   10,  6)
ON CONFLICT DO NOTHING;

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, type) VALUES
  (1, 1, CURRENT_DATE,     '10:00:00', 'Confirmed',  'Emergency'),
  (2, 2, CURRENT_DATE + 1, '14:30:00', 'Pending',    'Consultation'),
  (3, 3, CURRENT_DATE + 2, '09:00:00', 'Pending',    'Follow-up'),
  (4, 1, CURRENT_DATE + 3, '11:00:00', 'Confirmed',  'Routine Check'),
  (5, 4, CURRENT_DATE + 1, '16:00:00', 'Pending',    'Consultation')
ON CONFLICT DO NOTHING;

INSERT INTO inventory (item_name, quantity, category, status) VALUES
  ('Paracetamol 500mg',   500, 'Medication',  'In Stock'),
  ('Surgical Gloves (L)', 200, 'Consumable',  'In Stock'),
  ('IV Drip Set',          50, 'Equipment',   'In Stock'),
  ('Morphine 10mg',        20, 'Medication',  'Low Stock'),
  ('Blood Pressure Monitor',5, 'Equipment',   'In Stock')
ON CONFLICT DO NOTHING;
"""

def main():
    url = os.getenv("DATABASE_URL")
    if not url:
        print("ERROR: DATABASE_URL not set in .env")
        return

    print("Connecting to Supabase...")
    try:
        with psycopg.connect(url) as conn:
            print("Connected! Creating tables and seeding data...")
            with conn.cursor() as cur:
                cur.execute(SQL)
            conn.commit()
            print("\n" + "=" * 50)
            print("  SUCCESS! All tables created and seeded.")
            print("  You can now run: python app.py")
            print("=" * 50 + "\n")
    except Exception as e:
        print(f"\nERROR: {e}")

if __name__ == "__main__":
    main()
