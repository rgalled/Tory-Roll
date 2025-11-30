import { Connection } from "mysql2/promise";

export interface Alergeno {
  id: number;
  nombre: string;
  svg: string;
}

export class AlergenoModel {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async obtenerTodos(): Promise<Alergeno[]> {
    const [alergenos] = await this.db.query(
      `SELECT id, nombre, svg FROM alergenos`
    );
    return alergenos as Alergeno[];
  }
}
