export interface Artefacto {
  id: number
  nombre: string
  descripcion: string
  codigo?: string
  /** `id_tipo` en BD (≥1); para GIFs usamos 1–4 en UI. */
  tipoArtefacto?: string
  idUsuario?: string
  categoria: "defensa" | "transporte" | "domestico" | "energia"
  origen: "terrestre" | "extraterrestre" | "saiyajin" | "namekiano"
  nivelPeligrosidad: number
  nivelConfidencialidad?: number
  estado?: "activo" | "en_pruebas" | "obsoleto"
  inventor?: string
  fechaCreacion?: string
  fechaActualizacion?: string
  /** Foto opcional (data URL). `null` en edición = quitar foto guardada localmente. */
  fotoDataUrl?: string | null
}
