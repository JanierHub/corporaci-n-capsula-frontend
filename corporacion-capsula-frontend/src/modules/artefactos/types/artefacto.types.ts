export interface Artefacto {
  id?: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  artifactType: string;
  category: "DEFENSE" | "TRANSPORT" | "DOMESTIC" | "ENERGY";
  origin: "TERRICOLA" | "SAIYAJIN" | "NAMEKIANO";
  inventor: string;
  dangerLevel: "High" | "Mid" | "Low";
  confidentialityLevel:
    | "Public"
    | "Restricted"
    | "Confidential"
    | "Ultra-confidential";
  state: "Activo" | "Inactivo";
}