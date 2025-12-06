import { useState, useEffect } from 'preact/hooks';
import BotonEditar from './BotonEditar.jsx';
import BotonEliminar from './BotonEliminar.jsx';

const API_URL = 'http://localhost:3000';

export default function TablaProductos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarProductos();

    window.recargarProductosGlobal = cargarProductos;
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos/todos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
      alert('Error cargando productos. Verifica que el servidor esté corriendo en http://localhost:3000');
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div class="table-container">
      <h2>Listado de platos</h2>
      <div class="filter-container">
        <label htmlFor="filter-name">Filtrar por título:</label>
        <input
          type="text"
          id="filter-name"
          placeholder="Escribe el nombre del plato..."
          value={filtro}
          onInput={(e) => setFiltro(e.target.value)}
        />
      </div>

      <table class="tabla-platos">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Alergenos</th>
            <th>Descripción</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colspan="7" style={{ textAlign: 'center', padding: '20px' }}>
                No hay productos
              </td>
            </tr>
          ) : (
            productosFiltrados.map(producto => (
              <tr key={producto.id}>
                <td>
                  {producto.url_imagen ? (
                    <img
                      src={`${API_URL}${producto.url_imagen}`}
                      alt={producto.nombre}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: '#ddd', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                      Sin imagen
                    </div>
                  )}
                </td>
                <td>{producto.nombre || 'Sin nombre'}</td>
                <td style={{ textTransform: 'capitalize' }}>{producto.tipo || 'Sin categoría'}</td>
                <td>{producto.precio ? Number(producto.precio).toFixed(2) : '0.00'}€</td>
                <td>
                  {producto.alergenos && producto.alergenos.length > 0
                    ? producto.alergenos.map(a => a.nombre).join(', ')
                    : 'Ninguno'}
                </td>
                <td>{producto.descripcion || '-'}</td>
                <td>
                  <BotonEditar producto={producto} />
                </td>
                <td>
                  <BotonEliminar producto={producto} onEliminar={cargarProductos} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
