const API_URL = "http://localhost:3000";

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return await res.json();
}
