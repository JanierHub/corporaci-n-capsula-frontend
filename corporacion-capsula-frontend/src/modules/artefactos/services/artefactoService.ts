import { api } from "../../../config/api";
import { Artefacto } from "../types/artefacto.types";

// 🔥 GET
export const getArtefactos = async (): Promise<Artefacto[]> => {
  const res = await api.get("/artifacts");
  return res.data;
};

// 🔥 CREATE
export const createArtefacto = async (
  data: Artefacto
): Promise<Artefacto> => {
  const res = await api.post("/artifacts", data);
  return res.data.data;
};

// 🔥 UPDATE
export const updateArtefacto = async (
  id: string,
  data: Partial<Artefacto>
): Promise<Artefacto> => {
  const res = await api.patch(`/artifacts/${id}`, data);
  return res.data.data;
};

// 🔥 DESACTIVAR (CON TOKEN)
export const deactivateArtefacto = async (
  id: string
): Promise<Artefacto> => {
  const token = localStorage.getItem("token");

  const res = await api.patch(
    `/artifacts/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
};