const API_BASE_URL = "http://localhost:5000/api";

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function fetchPatients() {
  const response = await fetch(`${API_BASE_URL}/patients`);
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
}

export async function fetchDoctors() {
  const response = await fetch(`${API_BASE_URL}/doctors`);
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
}

export async function fetchAppointments() {
  const response = await fetch(`${API_BASE_URL}/appointments`);
  if (!response.ok) throw new Error("Failed to fetch appointments");
  return response.json();
}

export async function fetchDepartments() {
  const response = await fetch(`${API_BASE_URL}/departments`);
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
}

export async function fetchInventory() {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
}

export async function fetchBilling() {
  const response = await fetch(`${API_BASE_URL}/billing`);
  if (!response.ok) throw new Error("Failed to fetch billing");
  return response.json();
}

export async function fetchWards() {
  const response = await fetch(`${API_BASE_URL}/wards`);
  if (!response.ok) throw new Error("Failed to fetch wards");
  return response.json();
}

export async function fetchAdmissions() {
  const response = await fetch(`${API_BASE_URL}/admissions`);
  if (!response.ok) throw new Error("Failed to fetch admissions");
  return response.json();
}

export async function createPatient(data: {
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  blood_group: string;
}) {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create patient");
  return response.json();
}

export async function createAppointment(data: {
  patient_id: string | number;
  doctor_id: string | number;
  date: string;
  time: string;
}) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create appointment");
  return response.json();
}