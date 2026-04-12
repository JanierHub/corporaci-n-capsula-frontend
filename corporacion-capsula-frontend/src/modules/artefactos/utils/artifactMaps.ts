import type { Artefacto } from "../types/artefacto.types"

/** `id_categoria` en BD (1–4) → etiqueta UI / modelo interno. */
export function idCategoriaToCategoria(id: unknown): Artefacto["categoria"] {
  const n = Number(id)
  switch (n) {
    case 2:
      return "transporte"
    case 3:
      return "domestico"
    case 4:
      return "energia"
    case 1:
    default:
      return "defensa"
  }
}

export function categoriaToIdCategoria(value?: Artefacto["categoria"]): number {
  switch (value) {
    case "transporte":
      return 2
    case "domestico":
      return 3
    case "energia":
      return 4
    case "defensa":
    default:
      return 1
  }
}

export const CATEGORIA_ID_LABELS: { id: number; label: string }[] = [
  { id: 1, label: "Defensa (id_categoria 1)" },
  { id: 2, label: "Transporte (id_categoria 2)" },
  { id: 3, label: "Doméstico (id_categoria 3)" },
  { id: 4, label: "Energía (id_categoria 4)" },
]
