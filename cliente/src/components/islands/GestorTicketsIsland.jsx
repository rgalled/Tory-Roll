// src/components/islands/GestorTicketsIsland.jsx
import { useEffect, useState } from "preact/hooks";
import { socket } from "../../lib/socket";
import TicketStatusIsland from "../islands/TicketStatusIsland.jsx"; 

export default function GestorTicketsIsland() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    socket.emit("obtenerPedidos");

    socket.on("listaPedidos", (lista) => {
      if (!Array.isArray(lista)) return;
      setPedidos(lista);
    });

    socket.on("listaPedidos", (lista) => setPedidos(Array.isArray(lista) ? lista : []));

    return () => {
      socket.off("listaPedidos");
    };
  }, []);

  function cambiarEstado(id, nuevoEstado) {
    socket.emit("actualizarEstado", { id, nuevoEstado });
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  }

  return (
    <section class="ticket-container">
      {pedidos.length === 0 ? (
        <p>No hay pedidos en este momento.</p>
      ) : (
        pedidos.map((pedido) => (
          <div class="ticket" key={pedido.id}>
            <h2>
              Ticket de la mesa <span class="id">{pedido.id}</span>
            </h2>

            <div class="ticket-items">
              <table>
                <thead>
                  <tr>
                    <th>Plato</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {(pedido.items || []).map((it, idx) => (
                
                    <tr key={it.id ?? idx}>
                      <td>{it.nombre}</td>
                      <td>{it.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div class="ticket-status">
             
              {/* Le pasamos un handler para que use socket.emit */}
              <TicketStatusIsland
                id={pedido.id}
                estado={pedido.estado}
                onChangeEstado={cambiarEstado}
              />
            </div>
          </div>
        ))
      )}
    </section>
  );
}
