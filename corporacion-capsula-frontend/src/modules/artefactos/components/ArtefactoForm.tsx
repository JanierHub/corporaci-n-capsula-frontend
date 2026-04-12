import { useEffect, useState } from "react"
import { Artefacto } from "../types/artefacto.types"
import { TIPO_ARTEFACTO_OPTIONS, gifPorIdTipo } from "../constants/artifactVisuals"
import { CATEGORIA_ID_LABELS, idCategoriaToCategoria } from "../utils/artifactMaps"

type Props = {
  onSubmit: (data: Partial<Artefacto>) => Promise<void> | void
  initialData?: Partial<Artefacto>
}

const defaultForm = (): Partial<Artefacto> => ({
  nombre: "",
  descripcion: "",
  fechaCreacion: new Date().toISOString().split("T")[0],
  tipoArtefacto: "1",
  categoria: "defensa",
  origen: "terrestre",
  nivelPeligrosidad: 1,
  nivelConfidencialidad: 1,
  estado: "activo",
})

const MAX_FOTO_BYTES = 1_800_000

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<Partial<Artefacto>>(defaultForm)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      const base = { ...defaultForm(), ...initialData }
      if (initialData.fotoDataUrl) setFotoPreview(initialData.fotoDataUrl)
      setForm(base)
      return
    }
    setForm(defaultForm())
    setFotoPreview(null)
  }, [initialData])

  const idTipoNum = Math.min(4, Math.max(1, Number(form.tipoArtefacto) || 1))
  const gifVista = gifPorIdTipo(form.tipoArtefacto)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setError("")
    setForm({
      ...form,
      [name]:
        name === "nivelPeligrosidad" || name === "nivelConfidencialidad"
          ? Number(value)
          : value,
    })
  }

  const handleCategoriaById = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    setError("")
    setForm({
      ...form,
      categoria: idCategoriaToCategoria(id),
    })
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError("")
    if (!file) {
      setFotoPreview(null)
      setForm((f) => ({ ...f, fotoDataUrl: undefined }))
      return
    }
    if (file.size > MAX_FOTO_BYTES) {
      setError("La imagen es demasiado grande (máx. ~1,7 MB).")
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "")
      setFotoPreview(dataUrl)
      setForm((f) => ({ ...f, fotoDataUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const quitarFoto = () => {
    setFotoPreview(null)
    setForm((f) => ({ ...f, fotoDataUrl: initialData ? null : undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.nombre?.trim()) {
      setError("El nombre es obligatorio.")
      return
    }
    if (!form.descripcion?.trim()) {
      setError("La descripción es obligatoria.")
      return
    }
    if (!form.fechaCreacion || !/^\d{4}-\d{2}-\d{2}$/.test(form.fechaCreacion)) {
      setError("Indica una fecha válida (YYYY-MM-DD).")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...form,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        tipoArtefacto: String(Math.max(1, Number(form.tipoArtefacto ?? 1))),
        fotoDataUrl:
          form.fotoDataUrl === null ? null : form.fotoDataUrl || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    "w-full p-2 bg-black/60 border border-orange-400 rounded text-white placeholder:text-orange-200/60"

  const idCategoriaActual = CATEGORIA_ID_LABELS.find(
    (c) => idCategoriaToCategoria(c.id) === form.categoria
  )?.id ?? 1

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-orange-900/70 border-4 border-orange-400 p-6 rounded-xl w-full max-w-5xl mx-auto"
    >
      <h2 className="text-orange-300 text-xl mb-2 font-bold text-center">
        {initialData ? "Editar Artefacto" : "Registrar Artefacto"}
      </h2>
      <p className="text-orange-200/80 text-xs text-center mb-5">
        Campos alineados con POST <code className="text-yellow-200">/api/v1/artifacts</code>:
        nombre_artefacto, descripcion, fecha_creacion, id_tipo, id_categoria, origen, nivel_peligrosidad,
        confidentialityLevel opcional.
      </p>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-400 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          name="nombre"
          placeholder="nombre_artefacto"
          value={form.nombre || ""}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <input
          type="date"
          name="fechaCreacion"
          value={form.fechaCreacion || ""}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="descripcion"
          placeholder="descripcion"
          value={form.descripcion || ""}
          onChange={(e) => {
            setError("")
            setForm({ ...form, descripcion: e.target.value })
          }}
          required
          className={`${inputClass} min-h-24 resize-none md:col-span-2`}
        />

        <div className="md:col-span-2">
          <label className="block text-orange-200 text-sm mb-1 font-semibold">
            Tipo de artefacto (id_tipo) — define el GIF de icono
          </label>
          <select
            name="tipoArtefacto"
            value={String(idTipoNum)}
            onChange={handleChange}
            className={inputClass}
          >
            {TIPO_ARTEFACTO_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center justify-center bg-black/30 rounded-lg p-4 border border-orange-500/40">
          <div className="relative w-44 h-44 rounded-lg overflow-hidden border-2 border-orange-400 shrink-0">
            <img
              src={fotoPreview || gifVista}
              alt="Vista tipo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-sm text-orange-100/90 max-w-md">
            <p className="font-semibold text-yellow-300 mb-1">Vista previa</p>
            <p>
              Por defecto se usa el GIF del <strong>tipo</strong> (id_tipo). Opcionalmente sube una foto
              propia (se guarda en el navegador por id hasta que el API permita adjuntos).
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-orange-200 text-sm mb-1">Foto opcional (archivo)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className={`${inputClass} text-sm file:mr-3 file:rounded file:border-0 file:bg-orange-500 file:px-3 file:py-1`}
          />
          {fotoPreview ? (
            <button
              type="button"
              onClick={quitarFoto}
              className="mt-2 text-xs text-red-300 underline"
            >
              Quitar foto y usar solo el GIF del tipo
            </button>
          ) : null}
        </div>

        <div>
          <label className="block text-orange-200 text-sm mb-1">id_categoria (BD)</label>
          <select
            value={idCategoriaActual}
            onChange={handleCategoriaById}
            className={inputClass}
          >
            {CATEGORIA_ID_LABELS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <select name="origen" value={form.origen || ""} onChange={handleChange} className={inputClass}>
          <option value="">origen (API)</option>
          <option value="terrestre">TERRICOLA (terrestre)</option>
          <option value="saiyajin">SAIYAJIN</option>
          <option value="namekiano">NAMEKIANO</option>
        </select>

        <select
          name="nivelPeligrosidad"
          value={form.nivelPeligrosidad || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">nivel_peligrosidad</option>
          <option value={1}>1 — Sin peligro</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5 — Destrucción masiva</option>
        </select>

        <select
          name="nivelConfidencialidad"
          value={form.nivelConfidencialidad || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">confidentialityLevel (opcional en API)</option>
          <option value={1}>Public</option>
          <option value={2}>Restricted</option>
          <option value={3}>Confidential</option>
          <option value={4}>Ultra-confidential</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-400 text-black p-2 mt-4 font-bold rounded disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Guardando..." : "Guardar Artefacto"}
      </button>
    </form>
  )
}

export default ArtefactoForm
