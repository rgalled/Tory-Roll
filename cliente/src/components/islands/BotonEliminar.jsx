const API_URL = 'http://localhost:3000';

export default function BotonEliminar({ producto, onEliminar }) {
  const handleEliminar = async () => {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/productos/${producto.id}`, { 
        method: 'DELETE' 
      });
      
      if (res.ok) {
        alert('✅ Producto eliminado');
        if (onEliminar) onEliminar();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Error: ${errorData.error || 'No se pudo eliminar'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert(`❌ Error de conexión: ${err.message}`);
    }
  };

  return (
    <button class="btn-delete" onClick={handleEliminar}>
      Eliminar
    </button>
  );
}
