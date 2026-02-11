import os
import psycopg
from psycopg.rows import dict_row
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------- DB CONNECTION ----------
def get_db_connection():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )

# ---------- HEALTH ----------
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "hospital-backend"})

# ---------- PATIENTS ----------
@app.route('/api/patients', methods=['GET'])
def get_patients():
    conn = get_db_connection()
    try:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT * FROM patients ORDER BY id DESC")
            patients = cur.fetchall()
            return jsonify(patients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/patients', methods=['POST'])
def add_patient():
    new_patient = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO patients (name, age, gender, phone, department, status, doctor_name)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    new_patient["name"],
                    new_patient["age"],
                    new_patient["gender"],
                    new_patient["phone"],
                    new_patient["department"],
                    new_patient["status"],
                    new_patient["doctor"]
                )
            )
            patient_id = cur.fetchone()[0]
            conn.commit()
            return jsonify({"id": patient_id, "message": "Patient created"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        conn.close()

# ---------- DOCTORS ----------
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    conn = get_db_connection()
    try:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT * FROM doctors")
            doctors = cur.fetchall()
            return jsonify(doctors)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ---------- APPOINTMENTS ----------
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = get_db_connection()
    try:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT * FROM appointments ORDER BY date DESC, time ASC")
            appointments = cur.fetchall()
            return jsonify(appointments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ---------- WARDS ----------
@app.route('/api/wards', methods=['GET'])
def get_wards():
    conn = get_db_connection()
    try:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT * FROM wards")
            wards = cur.fetchall()
            return jsonify(wards)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ---------- DASHBOARD STATS ----------
@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM patients")
            total_patients = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM doctors WHERE status = 'Available'")
            available_doctors = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM appointments WHERE status = 'Pending'")
            pending_appointments = cur.fetchone()[0]

            cur.execute("SELECT SUM(total_beds), SUM(occupied_beds) FROM wards")
            bed_stats = cur.fetchone()

            total_beds = bed_stats[0] or 0
            occupied_beds = bed_stats[1] or 0
            available_beds = total_beds - occupied_beds

            return jsonify({
                "total_patients": total_patients,
                "available_doctors": available_doctors,
                "pending_appointments": pending_appointments,
                "available_beds": available_beds
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
