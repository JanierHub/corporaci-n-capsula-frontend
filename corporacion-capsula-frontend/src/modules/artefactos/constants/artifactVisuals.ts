import transporteGif from "../../../assets/1.gif"
import energiaGif from "../../../assets/11.gif"
import domesticoGif from "../../../assets/13.gif"
import defensaGif from "../../../assets/5.gif"

/**
 * `id_tipo` en BD (1–4) define el GIF de vista previa / lista (coincide con POST create).
 * Ajusta si tu tabla `tipo` usa otros IDs.
 */
export const TIPO_ARTEFACTO_OPTIONS = [
  { id: 1, label: "Transporte", gif: transporteGif },
  { id: 2, label: "Energía", gif: energiaGif },
  { id: 3, label: "Doméstico", gif: domesticoGif },
  { id: 4, label: "Defensa", gif: defensaGif },
] as const

export function gifPorIdTipo(id: number | string | undefined): string {
  const n = Math.min(4, Math.max(1, Number(id) || 1))
  const row = TIPO_ARTEFACTO_OPTIONS.find((t) => t.id === n)
  return row?.gif ?? energiaGif
}
