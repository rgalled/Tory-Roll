import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import { createConnection } from "./src/config/database.js";
import { ProductoModel } from "./src/models/Producto.js";
import { AlergenoModel } from "./src/models/Alergeno.js";
import { ProductoController } from "./src/controllers/ProductoController.js";
import { AlergenoController } from "./src/controllers/AlergenoController.js";
import { createProductoRoutes } from "./src/routes/productoRoutes.js";
import { createAlergenoRoutes } from "./src/routes/alergenoRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/imagenes', express.static('imagenes'));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const db = await createConnection();

const productoModel = new ProductoModel(db);
const alergenoModel = new AlergenoModel(db);

const productoController = new ProductoController(productoModel);
const alergenoController = new AlergenoController(alergenoModel);

app.use(createProductoRoutes(productoController));
app.use(createAlergenoRoutes(alergenoController));

interface Pedido {
  id: string;
  socketId: string;
  items: any[];
  estado: string;
  fecha: string;
}

const pedidos: Record<string, Pedido> = {};

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("nuevoPedido", (pedido) => {
    const id = randomUUID();
    const nuevoPedido: Pedido = {
      id,
      socketId: socket.id,
      items: pedido.items,
      estado: "recibido",
      fecha: new Date().toISOString(),
    };

    pedidos[id] = nuevoPedido;

    socket.emit("estadoPedido", nuevoPedido);

    io.emit("listaPedidos", Object.values(pedidos));

    console.log(`🧾 Pedido nuevo ${id} recibido de ${socket.id}`);
  });

  socket.on("actualizarEstado", ({ id, nuevoEstado }) => {
    const pedido = pedidos[id];
    if (!pedido) return;

    pedido.estado = nuevoEstado;

    io.to(pedido.socketId).emit("estadoPedido", pedido);

    io.emit("listaPedidos", Object.values(pedidos));

    console.log(`📦 Pedido ${id} actualizado a "${nuevoEstado}"`);
  });

  socket.on("obtenerPedidos", () => {
    socket.emit("listaPedidos", Object.values(pedidos));
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
