import { api } from "../../../config/api";
import { Artefacto } from "../types/artefacto.types";

// 🔥 MOCK VISUAL (ESTILO DBZ)
const mockArtefactos: Artefacto[] = [
  {
    id: "1",
    code: "CAP-001",
    name: "Capsula Hoi Poi",
    description: "Permite almacenar objetos en miniatura",
    createdAt: "2026-04-08",
    artifactType: "Tecnología",
    category: "DOMESTIC",
    origin: "TERRICOLA",
    inventor: "Bulma",
    dangerLevel: "Low",
    confidentialityLevel: "Public",
    state: "Activo",
  },
  {
    id: "2",
    code: "RAD-002",
    name: "Radar del Dragón",
    description: "Detecta esferas del dragón",
    createdAt: "2026-04-08",
    artifactType: "Detector",
    category: "ENERGY",
    origin: "TERRICOLA",
    inventor: "Bulma",
    dangerLevel: "Mid",
    confidentialityLevel: "Restricted",
    state: "Activo",
  },
  {
    id: "3",
    code: "ARM-003",
    name: "Armadura Saiyajin",
    description: "Resiste ataques de alto nivel",
    createdAt: "2026-04-08",
    artifactType: "Defensa",
    category: "DEFENSE",
    origin: "SAIYAJIN",
    inventor: "Freezer Corp",
    dangerLevel: "High",
    confidentialityLevel: "Confidential",
    state: "Activo",
  },
];

// 🔥 GET (REAL + FALLBACK MOCK)
export const getArtefactos = async (): Promise<Artefacto[]> => {
  try {
    const res = await api.get("/artifacts");
    return res.data;
  } catch (error) {
    console.warn("⚠ usando mock");
    return mockArtefactos;
  }
};

// 🔥 CREATE
export const createArtefacto = async (data: Artefacto) => {
  const res = await api.post("/artifacts", data);
  return res.data.data;
};

// 🔥 UPDATE
export const updateArtefacto = async (
  id: string,
  data: Partial<Artefacto>
) => {
  const res = await api.patch(`/artifacts/${id}`, data);
  return res.data.data;
};

// 🔥 DEACTIVATE
export const deactivateArtefacto = async (id: string) => {
  const res = await api.patch(
    `/artifacts/${id}`,
    { state: "Inactivo" },
    {
      headers: {
        "x-role": "Administrador",
      },
    }
  );

  return res.data.data;
};