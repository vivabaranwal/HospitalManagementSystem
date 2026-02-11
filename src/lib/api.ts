const API_BASE_URL = "http://localhost:5000/api";

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

export async function fetchWards() {
  const response = await fetch(`${API_BASE_URL}/wards`);
  if (!response.ok) throw new Error("Failed to fetch wards");
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}