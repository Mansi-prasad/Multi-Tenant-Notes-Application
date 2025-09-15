const API_BASE_URL = (import.meta.env.VITE_API_URL || "") + "/api";

// build request headers
function createHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// request function
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json(); // parse and return json
}

// API Functions

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify({ email, password }),
  });
}

export function getNotes(token) {
  return request("/notes", {
    headers: createHeaders(token),
  });
}

export function createNote(token, noteData) {
  return request("/notes", {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(noteData),
  });
}

export function updateNote(token, id, noteData) {
  return request(`/notes/${id}`, {
    method: "PUT",
    headers: createHeaders(token),
    body: JSON.stringify(noteData),
  });
}

export function deleteNote(token, id) {
  return request(`/notes/${id}`, {
    method: "DELETE",
    headers: createHeaders(token),
  });
}

export function inviteUser(token, tenantSlug, email, role = "Member") {
  return request(`/tenants/${tenantSlug}/invite`, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify({ email, role }),
  });
}

export function upgradeTenant(token, tenantSlug) {
  return request(`/tenants/${tenantSlug}/upgrade`, {
    method: "POST",
    headers: createHeaders(token),
  });
}

export function health() {
  return request("/health", { headers: createHeaders() });
}
