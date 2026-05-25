/**
 * Auth helpers: store/retrieve/clear session from localStorage.
 */

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setSession(user, token, refresh_token) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('refresh_token', refresh_token);
}

export function clearSession() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
}

export function isAdmin() {
  const user = getUser();
  return user?.role === 'admin';
}

export function isAuthenticated() {
  return !!getToken();
}
