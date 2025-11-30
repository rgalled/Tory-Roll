import { Request, Response } from "express";
import { AlergenoModel } from "../models/Alergeno.js";

export class AlergenoController {
  private alergenoModel: AlergenoModel;

  constructor(alergenoModel: AlergenoModel) {
    this.alergenoModel = alergenoModel;
  }

  obtenerAlergenos = async (req: Request, res: Response) => {
    try {
      const alergenos = await this.alergenoModel.obtenerTodos();
      res.json(alergenos);
    } catch (err) {
      console.error("Error obteniendo alergenos:", err);
      res.status(500).json({ error: "Error al obtener los alergenos" });
    }
  };
}
