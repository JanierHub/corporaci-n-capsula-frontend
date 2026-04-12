export interface ArtefactoUI {
  id?: string;
  name: string;
  description: string;
  category: string;
  origin: string;
  dangerLevel: number;
  state: "Activo" | "Inactivo";
  inventor: string;
  createdAt: string;
}