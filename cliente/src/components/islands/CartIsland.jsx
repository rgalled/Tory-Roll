import { useEffect, useState } from "preact/hooks";
import { carritoGlobal } from "../../lib/cart";
import { socket } from "../../lib/socket";

function RemoveItem({ id }) {
  function remove() {
    carritoGlobal.eliminarProducto(id);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  return (
    <div class="object-options">
      <button class="object-delete" onClick={remove}>
        Eliminar
      </button>
    </div>
  );
}

export default function CartIsland() {
  const [items, setItems] = useState(carritoGlobal.obtenerLista());
  const [total, setTotal] = useState(carritoGlobal.total());

  function refresh() {
    setItems([...carritoGlobal.obtenerLista()]);
    setTotal(carritoGlobal.total());
  }

  useEffect(() => {
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  function enviarPedido() {
    const pedido = { items };
    socket.emit("nuevoPedido", pedido);
    carritoGlobal.vaciar();
    refresh();
  }

  return (
    <>
      {items.map((item) => (
        <div class="object">
          <div 
            class="object-img" 
            style={{
              backgroundImage: item.url_imagen 
                ? `url(http://localhost:3000${item.url_imagen})` 
                : 'url(/src/assets/img/sushi.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div class="object-content">
            <div class="object-text">
              <h1 class="object-title">{item.nombre}</h1>
              <h4 class="object-ammount">
                cantidad: <span>{item.cantidad}</span>
              </h4>
              <h4 class="object-ammount">
                precio: <span>{item.precio}</span>
              </h4>
            </div>

            <RemoveItem id={item.id} />
          </div>
        </div>
      ))}

      <div class="total">
        <a class="order" onClick={enviarPedido}>
          Ordenar Comanda
        </a>
      </div>
    </>
  );
}
