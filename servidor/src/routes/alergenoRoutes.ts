import { Router } from "express";
import { AlergenoController } from "../controllers/AlergenoController.js";

export const createAlergenoRoutes = (alergenoController: AlergenoController) => {
  const router = Router();

  router.get("/alergenos", alergenoController.obtenerAlergenos);

  return router;
};
