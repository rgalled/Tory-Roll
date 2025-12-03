import { useState, useEffect } from 'preact/hooks';

const API_URL = 'http://localhost:3000';

export default function FormularioProducto() {
  const [alergenos, setAlergenos] = useState([]);
  const [editando, setEditando] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    url_imagen: '',
    precio: '',
    alergenos: []
  });

  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    cargarAlergenos();
    
    window.editarProductoGlobal = (producto) => {
      setEditando(producto);
      const tipoValue = producto.tipo ? producto.tipo.toLowerCase() : '';
      setFormData({
        nombre: producto.nombre,
        tipo: tipoValue,
        descripcion: producto.descripcion || '',
        url_imagen: producto.url_imagen || '',
        precio: producto.precio.toString(),
        alergenos: producto.alergenos 
          ? producto.alergenos.map(a => a.id)
          : []
      });
      setPreviewImg(producto.url_imagen ? `http://localhost:3000${producto.url_imagen}` : null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.recargarProductosGlobal = () => {};
  }, []);

  const cargarAlergenos = async () => {
    try {
      const res = await fetch(`${API_URL}/alergenos`);
      const data = await res.json();
      setAlergenos(data);
    } catch (err) {
      console.error('Error cargando alergenos:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
        setFormData({ ...formData, url_imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
        setFormData({ ...formData, url_imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAlergeno = (id) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.includes(id)
        ? prev.alergenos.filter(a => a !== id)
        : [...prev.alergenos, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const datosEnviar = editando ? {} : {
      ...formData,
      precio: parseFloat(formData.precio)
    };

    if (editando) {
      if (formData.nombre) datosEnviar.nombre = formData.nombre;
      if (formData.tipo) datosEnviar.tipo = formData.tipo;
      if (formData.descripcion) datosEnviar.descripcion = formData.descripcion;
      if (formData.url_imagen && formData.url_imagen !== editando.url_imagen) {
        datosEnviar.url_imagen = formData.url_imagen;
      }
      if (formData.precio) datosEnviar.precio = parseFloat(formData.precio);
      datosEnviar.alergenos = formData.alergenos;
    }
    
    try {
      const url = editando 
        ? `${API_URL}/productos/${editando.id}`
        : `${API_URL}/productos`;
      
      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      });

      if (res.ok) {
        alert(editando ? 'Producto actualizado' : 'Producto añadido');
        limpiarForm();
        if (window.recargarProductosGlobal) {
          window.recargarProductosGlobal();
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert(`Error de conexión: ${err.message}`);
    }
  };

  const limpiarForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      descripcion: '',
      url_imagen: '',
      precio: '',
      alergenos: []
    });
    setPreviewImg(null);
    setEditando(null);
  };

  return (
    <div class="form-product">
      <h2>{editando ? 'Editar plato' : 'Añadir nuevo plato'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div 
          class="dropzone" 
          id="dropzone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {previewImg ? (
            <img src={previewImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px' }} />
          ) : (
            <>
              <i class="fa-solid fa-image"></i>
              <p>Arrastra una imagen aquí o haz clic</p>
            </>
          )}
          <input 
            type="file" 
            id="fileInput" 
            hidden 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div class="form-group">
          <label>Título del plato</label>
          <input 
            type="text" 
            placeholder="Ej. Nigiri de salmón"
            value={formData.nombre}
            onInput={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required={!editando}
          />
        </div>

        <div class="form-group">
          <label>Tipo de plato</label>
          <select 
            class="tipo-plato"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            required={!editando}
          >
            <option value="">Seleccionar tipo...</option>
            <option value="nigiri">Nigiri</option>
            <option value="sashimi">Sashimi</option>
            <option value="uramaki">Uramaki</option>
            <option value="ramen">Ramen</option>
            <option value="gyoza">Gyoza</option>
            <option value="karage">Karage</option>
            <option value="postre">Postre</option>
            <option value="bebida">Bebida</option>
          </select>
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            placeholder="Describe brevemente el plato..."
            value={formData.descripcion}
            onInput={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          ></textarea>
        </div>

        <div class="form-group">
          <label>Alergenos</label>
          <div class="alerg-container">
            {alergenos.map(alerg => (
              <label key={alerg.id}>
                <input 
                  type="checkbox" 
                  checked={formData.alergenos.includes(alerg.id)}
                  onChange={() => toggleAlergeno(alerg.id)}
                />
                {' '}{alerg.nombre}
              </label>
            ))}
          </div>
        </div>

        <div class="form-group">
          <label>Precio (€)</label>
          <input 
            type="number" 
            value={formData.precio}
            step="0.01"
            min="0"
            placeholder="0.00"
            onInput={(e) => setFormData({ ...formData, precio: e.target.value })}
            required={!editando}
          />
        </div>
            <br></br>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" class="btn-save">
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
          {editando && (
            <button 
              type="button" 
              class="btn-cancel"
              onClick={limpiarForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
