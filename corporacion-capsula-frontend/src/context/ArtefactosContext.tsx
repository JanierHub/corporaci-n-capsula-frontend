import { createContext, useContext, useState } from "react";

import {
  getArtefactos,
  createArtefacto,
  updateArtefacto,
  deactivateArtefacto as deactivateService,
} from "../modules/artefactos/services/artefactoService";

import { Artefacto } from "../modules/artefactos/types/artefacto.types";

type ContextType = {
  artefactos: Artefacto[];
  loadArtefactos: () => Promise<void>;
  addArtefacto: (a: Artefacto) => Promise<void>;
  editArtefacto: (id: string, data: Partial<Artefacto>) => Promise<void>;
  deactivateArtefacto: (id: string) => Promise<void>;
};

const ArtefactosContext = createContext<ContextType | null>(null);

export const ArtefactosProvider = ({ children }: any) => {
  const [artefactos, setArtefactos] = useState<Artefacto[]>([]);

  // 🔥 GET
  const loadArtefactos = async () => {
    try {
      const data = await getArtefactos();
      setArtefactos(data);
    } catch (error) {
      console.error("Error cargando artefactos:", error);
    }
  };

  // 🔥 CREATE
  const addArtefacto = async (a: Artefacto) => {
    try {
      const nuevo = await createArtefacto(a);
      setArtefactos((prev) => [...prev, nuevo]);
    } catch (error) {
      console.error("Error creando artefacto:", error);
    }
  };

  // 🔥 UPDATE (PATCH)
  const editArtefacto = async (id: string, data: Partial<Artefacto>) => {
    try {
      const updated = await updateArtefacto(id, data);

      setArtefactos((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
    } catch (error) {
      console.error("Error editando artefacto:", error);
    }
  };

  // 🔥 DEACTIVATE (SOFT DELETE + ROLE)
  const deactivateArtefacto = async (id: string) => {
    try {
      const updated = await deactivateService(id);

      setArtefactos((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
    } catch (error) {
      console.error("Error desactivando artefacto:", error);
    }
  };

  return (
    <ArtefactosContext.Provider
      value={{
        artefactos,
        loadArtefactos,
        addArtefacto,
        editArtefacto,
        deactivateArtefacto,
      }}
    >
      {children}
    </ArtefactosContext.Provider>
  );
};

export const useArtefactos = () => {
  const ctx = useContext(ArtefactosContext);
  if (!ctx) throw new Error("useArtefactos debe usarse dentro del provider");
  return ctx;
};