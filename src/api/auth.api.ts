export function authHeader() {
  const token = localStorage.getItem("token");
  if (!token) return {}; // <== aman

  return {
    Authorization: `Bearer ${token}`,
  };
}
