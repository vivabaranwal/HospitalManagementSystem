import os
from datetime import date, time, datetime
import psycopg
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from psycopg.rows import dict_row
from flask.json.provider import DefaultJSONProvider

load_dotenv()

# ── Flask 3.x JSON provider that handles date/time/Decimal ───────────────────
class HMSJSONProvider(DefaultJSONProvider):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        if isinstance(o, date):
            return o.isoformat()
        if isinstance(o, time):
            return o.strftime("%H:%M")
        return super().default(o)

app = Flask(__name__)
app.json_provider_class = HMSJSONProvider
app.json = HMSJSONProvider(app)

CORS(app)  # Allow all origins for local dev

def get_db():
    """Open a psycopg3 connection with dict_row factory."""
    return psycopg.connect(os.getenv("DATABASE_URL"), row_factory=dict_row)

def rows_to_list(rows):
    """Convert a list of psycopg3 Row objects to plain dicts."""
    return [dict(r) for r in rows]

# ── HEALTH ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "HMS Backend v3.0"})

# ── STATS (Dashboard) ─────────────────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        with get_db() as conn:
            from psycopg.rows import tuple_row
            with conn.cursor(row_factory=tuple_row) as cur:
                cur.execute("SELECT COUNT(*) FROM patients")
                total_patients = cur.fetchone()[0]

                cur.execute("SELECT COUNT(*) FROM doctors")
                total_doctors = cur.fetchone()[0]

                cur.execute(
                    "SELECT COUNT(*) FROM appointments WHERE status IN ('Pending','Scheduled')"
                )
                pending_appointments = cur.fetchone()[0]

                cur.execute("SELECT COALESCE(SUM(available_beds), 0) FROM wards")
                available_beds = cur.fetchone()[0]

        return jsonify({
            "total_patients": int(total_patients),
            "total_doctors": int(total_doctors),
            "pending_appointments": int(pending_appointments),
            "available_beds": int(available_beds),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── PATIENTS ──────────────────────────────────────────────────────────────────
@app.route("/api/patients", methods=["GET", "POST"])
def handle_patients():
    try:
        if request.method == "GET":
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM patients ORDER BY patient_id DESC")
                    return jsonify(rows_to_list(cur.fetchall()))

        data = request.get_json(silent=True) or {}
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO patients (name, age, gender, contact, address, blood_group)
                       VALUES (%s, %s, %s, %s, %s, %s) RETURNING patient_id""",
                    (
                        data.get("name"), data.get("age"), data.get("gender"),
                        data.get("contact"), data.get("address"), data.get("blood_group"),
                    ),
                )
                new_id = cur.fetchone()["patient_id"]
            conn.commit()
        return jsonify({"id": new_id, "message": "Patient registered"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── DOCTORS ───────────────────────────────────────────────────────────────────
@app.route("/api/doctors", methods=["GET"])
def get_doctors():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT d.doctor_id, d.name, d.specialization, d.phone, d.email,
                           COALESCE(d.status, 'Available') AS status,
                           dept.department_name
                    FROM doctors d
                    LEFT JOIN departments dept ON d.department_id = dept.department_id
                    ORDER BY d.name
                """)
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── DEPARTMENTS ───────────────────────────────────────────────────────────────
@app.route("/api/departments", methods=["GET"])
def get_departments():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM departments ORDER BY department_name")
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── APPOINTMENTS ──────────────────────────────────────────────────────────────
@app.route("/api/appointments", methods=["GET", "POST"])
def handle_appointments():
    try:
        if request.method == "GET":
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT
                            a.appointment_id   AS id,
                            a.appointment_date AS date,
                            a.appointment_time AS time,
                            a.status,
                            a.type,
                            p.name             AS patient_name,
                            d.name             AS doctor_name,
                            dept.department_name AS department
                        FROM appointments a
                        JOIN patients p    ON a.patient_id = p.patient_id
                        JOIN doctors d     ON a.doctor_id  = d.doctor_id
                        LEFT JOIN departments dept ON d.department_id = dept.department_id
                        ORDER BY a.appointment_date DESC
                    """)
                    return jsonify(rows_to_list(cur.fetchall()))

        data = request.get_json(silent=True) or {}
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO appointments
                        (patient_id, doctor_id, appointment_date, appointment_time, status)
                    VALUES (%s, %s, %s, %s, 'Pending')
                    RETURNING appointment_id
                """, (data.get("patient_id"), data.get("doctor_id"),
                      data.get("date"), data.get("time")))
                new_id = cur.fetchone()["appointment_id"]
            conn.commit()
        return jsonify({"id": new_id, "message": "Appointment booked"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ── WARDS ─────────────────────────────────────────────────────────────────────
@app.route("/api/wards", methods=["GET"])
def get_wards():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM wards ORDER BY ward_id ASC")
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── ADMISSIONS ────────────────────────────────────────────────────────────────
@app.route("/api/admissions", methods=["GET"])
def get_admissions():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT adm.*, p.name AS patient_name, w.ward_name
                    FROM admissions adm
                    JOIN patients p ON adm.patient_id = p.patient_id
                    JOIN wards    w ON adm.ward_id    = w.ward_id
                    ORDER BY adm.admission_date DESC
                """)
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── BILLING ───────────────────────────────────────────────────────────────────
@app.route("/api/billing", methods=["GET"])
def get_billing():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT b.*, p.name AS patient_name
                    FROM billing b
                    JOIN patients p ON b.patient_id = p.patient_id
                    ORDER BY b.billing_date DESC
                """)
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── INVENTORY ─────────────────────────────────────────────────────────────────
@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM inventory ORDER BY item_name")
                return jsonify(rows_to_list(cur.fetchall()))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── ENTRY POINT ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n" + "=" * 55)
    print("  HMS Flask API   -->  http://localhost:5000")
    print("  Health check    -->  http://localhost:5000/health")
    print("=" * 55 + "\n")
    app.run(debug=True, port=5000)  

