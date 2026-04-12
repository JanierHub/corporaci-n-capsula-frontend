import { useEffect, useState } from "react"
import type { Artefacto, ArtefactoFormPayload } from "../types/artefacto.types"

import transporteGif from "../../../assets/transporte.gif"
import energiaGif from "../../../assets/energia.gif"
import domesticaGif from "../../../assets/domestica.gif"
import defensaGif from "../../../assets/defensa.gif"

const defaultByCategoria = (c: Artefacto["categoria"] | undefined) => {
  switch (c) {
    case "transporte":
      return transporteGif
    case "energia":
      return energiaGif
    case "domestico":
      return domesticaGif
    case "defensa":
      return defensaGif
    default:
      return energiaGif
  }
}

const slugFromIdCat = (n: number): Artefacto["categoria"] => {
  const m: Record<number, Artefacto["categoria"]> = {
    1: "transporte",
    2: "domestico",
    3: "energia",
    4: "defensa",
  }
  return m[n] ?? "defensa"
}

const inferOrigenDb = (a: Partial<Artefacto> | undefined): string => {
  const raw = a?.origenDb?.trim().toUpperCase()
  if (raw === "TERRICOLA" || raw === "SAIYAJIN" || raw === "NAMEKIANO") return raw
  const o = String(a?.origen ?? "").toLowerCase()
  if (o.includes("namek")) return "NAMEKIANO"
  if (o.includes("saiy")) return "SAIYAJIN"
  return "TERRICOLA"
}

const origenUiFromDb = (db: string): Artefacto["origen"] => {
  const u = db.toUpperCase()
  if (u === "NAMEKIANO" || u === "SAIYAJIN") return "extraterrestre"
  return "terrestre"
}

const fmtDateInput = (s: string | undefined) => {
  if (!s) return ""
  const t = s.trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10)
  return ""
}

const idCatSelectValue = (a: Partial<Artefacto> | undefined): string => {
  if (a?.idCategoria != null && a.idCategoria >= 1 && a.idCategoria <= 4) {
    return String(a.idCategoria)
  }
  const slug = a?.categoria
  if (slug === "transporte") return "1"
  if (slug === "domestico") return "2"
  if (slug === "energia") return "3"
  if (slug === "defensa") return "4"
  return "1"
}

type Props = {
  onSubmit: (data: ArtefactoFormPayload) => void
  initialData?: Partial<Artefacto>
  mode?: "create" | "edit"
}

const MAX_FILE_READ = 2_500_000

const ArtefactoForm = ({ onSubmit, initialData, mode = "create" }: Props) => {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fecha, setFecha] = useState("")
  const [idTipo, setIdTipo] = useState("1")
  const [idCategoria, setIdCategoria] = useState("1")
  const [origen, setOrigen] = useState("TERRICOLA")
  const [inventor, setInventor] = useState("")
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState("1")
  const [previewImagen, setPreviewImagen] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      setNombre("")
      setDescripcion("")
      setFecha(new Date().toISOString().slice(0, 10))
      setIdTipo("1")
      setIdCategoria("1")
      setOrigen("TERRICOLA")
      setInventor("")
      setNivelPeligrosidad("1")
      setPreviewImagen(null)
      return
    }

    setNombre(initialData.nombre ?? "")
    setDescripcion(initialData.descripcion ?? "")
    setFecha(fmtDateInput(initialData.fechaCreacion))
    setIdTipo(
      initialData.idTipo != null && initialData.idTipo > 0
        ? String(initialData.idTipo)
        : "1"
    )
    setIdCategoria(idCatSelectValue(initialData))
    setOrigen(inferOrigenDb(initialData))
    setInventor(initialData.inventor ?? "")
    setNivelPeligrosidad(
      String(
        initialData.nivelPeligrosidad != null && initialData.nivelPeligrosidad >= 1
          ? initialData.nivelPeligrosidad
          : 1
      )
    )
    setPreviewImagen(initialData.imagenPersonalizada ?? null)
  }, [initialData])

  const categoriaSlug = slugFromIdCat(Number(idCategoria))
  const vistaPrevia = previewImagen ?? defaultByCategoria(categoriaSlug)

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/")) {
      window.alert("Elegí un archivo de imagen (PNG, JPG, WebP, etc.).")
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const s = String(reader.result ?? "")
      if (s.length > MAX_FILE_READ) {
        window.alert("La imagen es demasiado grande. Probá con otra más liviana.")
        return
      }
      setPreviewImagen(s)
    }
    reader.readAsDataURL(f)
    e.target.value = ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ic = Number(idCategoria)
    const tipo = Number(idTipo) || 1
    const np = Number(nivelPeligrosidad) || 1
    const oDb = origen

    const payload: ArtefactoFormPayload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      fechaCreacion: fecha,
      idCategoria: ic,
      idTipo: tipo,
      origenDb: oDb,
      categoria: slugFromIdCat(ic),
      origen: origenUiFromDb(oDb),
      nivelPeligrosidad: np,
      inventor: inventor.trim(),
      imagenDataUrl: previewImagen,
    }

    onSubmit(payload)
  }

  const title = mode === "edit" ? "Editar artefacto" : "Registrar artefacto"
  const cta = mode === "edit" ? "Guardar cambios" : "Guardar artefacto"

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-orange-900/80 border-4 border-orange-400 rounded-xl p-6 w-full max-w-4xl mx-auto shadow-[0_0_20px_orange]"
    >
      <h2 className="text-2xl text-yellow-300 font-bold mb-6 text-center">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 rounded-lg border border-orange-400/60 bg-black/40 p-4">
          <p className="text-yellow-200/90 text-sm font-semibold mb-2">
            Imagen del artefacto (opcional)
          </p>
          <p className="text-gray-400 text-xs mb-3">
            Si no subís ninguna, se usa la imagen predeterminada de la categoría (abajo).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden border-2 border-orange-500/50 bg-black flex items-center justify-center shrink-0">
              <img
                src={vistaPrevia}
                alt="Vista previa"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm text-cyan-200 cursor-pointer inline-flex items-center gap-2">
                <span className="px-3 py-2 bg-orange-700 rounded-lg border border-orange-400 hover:bg-orange-600">
                  Elegir imagen
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />
              </label>
              {previewImagen ? (
                <button
                  type="button"
                  className="text-sm text-red-300 underline w-fit"
                  onClick={() => setPreviewImagen(null)}
                >
                  Quitar imagen personalizada
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white col-span-2"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="col-span-2 p-2 bg-black border border-orange-400 rounded text-white min-h-[88px]"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <input
          placeholder="Id tipo (número)"
          type="number"
          min={1}
          value={idTipo}
          onChange={(e) => setIdTipo(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <select
          value={idCategoria}
          onChange={(e) => setIdCategoria(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option value="1">Categoría: Transporte</option>
          <option value="2">Categoría: Doméstico</option>
          <option value="3">Categoría: Energía</option>
          <option value="4">Categoría: Defensa</option>
        </select>

        <select
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option value="TERRICOLA">Origen: Terrícola</option>
          <option value="SAIYAJIN">Origen: Saiyajin</option>
          <option value="NAMEKIANO">Origen: Namekiano</option>
        </select>

        <input
          placeholder="Inventor (opcional)"
          value={inventor}
          onChange={(e) => setInventor(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <select
          value={nivelPeligrosidad}
          onChange={(e) => setNivelPeligrosidad(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option value="1">Peligrosidad 1</option>
          <option value="2">Peligrosidad 2</option>
          <option value="3">Peligrosidad 3</option>
          <option value="4">Peligrosidad 4</option>
          <option value="5">Peligrosidad 5</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-6 w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-orange-500 transition"
      >
        {cta}
      </button>
    </form>
  )
}

export default ArtefactoForm
