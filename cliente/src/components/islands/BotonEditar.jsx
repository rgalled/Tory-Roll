const API_URL = 'http://localhost:3000';

export default function BotonEditar({ producto }) {
  const handleEditar = () => {
    if (window.editarProductoGlobal) {
      window.editarProductoGlobal(producto);
    }
  };

  return (
    <button class="btn-edit" onClick={handleEditar}>
      Editar
    </button>
  );
}
