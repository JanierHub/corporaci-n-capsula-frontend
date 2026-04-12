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

/** Alineado con la API Express + tabla `artefacto` (backend Janier U/backend). */
export interface Artefacto {
  id: number
  nombre: string
  descripcion: string
  categoria: "transporte" | "domestico" | "energia" | "defensa"
  origen: "terrestre" | "extraterrestre"
  /** Valor en BD (`TERRICOLA` | `SAIYAJIN` | `NAMEKIANO`) para formularios y PATCH. */
  origenDb?: string
  nivelPeligrosidad: number
  nivelConfidencialidad: number
  idCategoria?: number
  idTipo?: number
  estado?: "activo" | "obsoleto" | "en_pruebas"
  inventor: string
  fechaCreacion: string
  fechaActualizacion: string
  /** Data URL guardada en localStorage (opcional). */
  imagenPersonalizada?: string
}

/** Datos del formulario crear/editar (incluye imagen solo en cliente). */
export type ArtefactoFormPayload = Partial<Artefacto> & {
  idTipo?: number
  imagenDataUrl?: string | null
}