import axios from "axios";
import { API_URL } from "../../../config/api";
import { Artefacto } from "../types/artefacto.types"

const API = `${API_URL}/artefactos`;

// 🔹 GET → listar artefactos
export const getArtefactos = async () => {
  return [
    {
      id: 1,
      nombre: "Capsula Hoi Poi",
      descripcion: "Permite almacenar objetos en miniatura",
      categoria: "domestico",
      origen: "terrestre",
      nivelPeligrosidad: 1,
      nivelConfidencialidad: 2,
    },
    {
      id: 2,
      nombre: "Radar del Dragón",
      descripcion: "Detecta esferas del dragón",
      categoria: "energia",
      origen: "terrestre",
      nivelPeligrosidad: 3,
      nivelConfidencialidad: 4,
    },
  ]
}

// 🔹 POST → crear artefacto
export const createArtefacto = async (data: Artefacto) => {
  const response = await axios.post(API, data);
  return response.data;
};

// 🔹 PUT → editar artefacto
export const updateArtefacto = async (id: number, data: Artefacto) => {
  const response = await axios.put(`${API}/${id}`, data);
  return response.data;
};

// 🔹 DELETE → eliminar artefacto
export const deleteArtefacto = async (id: number) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};
