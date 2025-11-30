import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const createConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
  });

  console.log("✅ Conectado a la base de datos MySQL");
  return connection;
};
