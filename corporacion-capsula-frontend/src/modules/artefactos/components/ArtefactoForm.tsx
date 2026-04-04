import { useState, useEffect } from "react"
import bulmaGif from "../../../assets/bulma2.gif"
import geroGif from "../../../assets/DCGero1.gif"

type Props = {
  onSubmit: (data: any) => void
  initialData?: any
}

const artefactosMock = [
  { codigo: "100100" },
  { codigo: "100101" },
  { codigo: "100200" },
  { codigo: "200100" },
  { codigo: "300100" },
  { codigo: "400100" },
  { codigo: "400200" },
]

const prefijoPorCategoria: Record<string, string> = {
  Transporte: "10",
  Energia: "20",
  Defensa: "30",
  Domestica: "40",
}

const generarCodigoSugerido = (categoria: string): string => {
  const prefijo = prefijoPorCategoria[categoria]
  if (!prefijo) return ""
  const deCategoria = artefactosMock.filter(a => a.codigo.startsWith(prefijo))
  const inventos = new Set(deCategoria.map(a => a.codigo.substring(2, 4)))
  const siguiente = String(inventos.size + 1).padStart(2, "0")
  return `${prefijo}${siguiente}00`
}

// 🔥 Suma +1 a la versión (últimos 2 dígitos)
const generarNuevaVersion = (codigoActual: string): string => {
  const base = codigoActual.substring(0, 4)
  const versionActual = parseInt(codigoActual.substring(4, 6))
  const nuevaVersion = String(versionActual + 1).padStart(2, "0")
  return `${base}${nuevaVersion}`
}

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
  const esEdicion = !!initialData

  const [codigo, setCodigo] = useState(initialData?.codigo || "")
  const [codigoSugerido, setCodigoSugerido] = useState("")
  const [codigoError, setCodigoError] = useState("")
  const [opcionCodigo, setOpcionCodigo] = useState<"mantener" | "version">("mantener") // solo edición
  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [categoria, setCategoria] = useState(initialData?.categoria || "")
  const [origen, setOrigen] = useState(initialData?.origen || "")
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState(initialData?.nivelPeligrosidad || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [inventor, setInventor] = useState(initialData?.inventor || "")
  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [necesidad, setNecesidad] = useState(initialData?.necesidad || "")
  const [tipoArtefacto, setTipoArtefacto] = useState(initialData?.tipoArtefacto || "")
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inventoresMock = [
    { nombre: "Bulma", gif: bulmaGif },
    { nombre: "Dr. Gero", gif: geroGif },
  ]

  const seleccionado = inventoresMock.find(i => i.nombre === inventor)

  // 🔥 Modo CREACIÓN: genera código sugerido al cambiar categoría
  useEffect(() => {
    if (esEdicion) return
    if (!categoria) {
      setCodigoSugerido("")
      setCodigo("")
      return
    }
    const sugerido = generarCodigoSugerido(categoria)
    setCodigoSugerido(sugerido)
    setCodigo(sugerido)
    setCodigoError("")
  }, [categoria])

  // 🔥 Modo EDICIÓN: cambia el código según la opción elegida
  useEffect(() => {
    if (!esEdicion) return
    if (opcionCodigo === "mantener") {
      setCodigo(initialData.codigo)
    } else {
      setCodigo(generarNuevaVersion(initialData.codigo))
    }
  }, [opcionCodigo])

  const handleCodigoChange = (valor: string) => {
    setCodigo(valor)
    const prefijo = prefijoPorCategoria[categoria]
    if (!valor) { setCodigoError("Requerido"); return }
    if (prefijo && !valor.startsWith(prefijo)) { setCodigoError(`Debe empezar por ${prefijo} (${categoria})`); return }
    if (!/^\d{6}$/.test(valor)) { setCodigoError("Debe tener exactamente 6 dígitos (ej: 100100)"); return }
    if (artefactosMock.some(a => a.codigo === valor)) { setCodigoError("Este código ya existe en el sistema"); return }
    setCodigoError("")
  }

  const handleImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!codigo.trim() || codigoError) newErrors.codigo = codigoError || "Requerido"
    if (!nombre.trim()) newErrors.nombre = "Requerido"
    if (!descripcion.trim()) newErrors.descripcion = "Requerido"
    if (!fecha) newErrors.fecha = "Requerido"
    if (!tipoArtefacto.trim()) newErrors.tipoArtefacto = "Requerido"
    if (!categoria) newErrors.categoria = "Requerido"
    if (!inventor.trim()) newErrors.inventor = "Requerido"
    if (!necesidad.trim()) newErrors.necesidad = "Requerido"
    if (!nivelPeligrosidad.trim()) newErrors.nivelPeligrosidad = "Requerido"
    if (!origen) newErrors.origen = "Requerido"
    if (!estado) newErrors.estado = "Requerido"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ codigo, nombre, descripcion, categoria, origen, nivelPeligrosidad, estado, inventor, fecha, necesidad, tipoArtefacto })
  }

  const inputClass = "w-full p-2 bg-black/60 border border-orange-400 rounded text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
  const inputDisabled = "w-full p-2 bg-black/30 border border-orange-400/40 rounded text-orange-200/50 cursor-not-allowed"
  const labelClass = "text-orange-300 text-xs mb-1 block font-semibold uppercase tracking-wider"
  const errorClass = "text-red-400 text-xs mt-1"

  return (
    <form
      className="bg-orange-900/70 border-4 border-orange-400 p-6 rounded-xl w-full max-w-5xl mx-auto shadow-[0_0_25px_orange]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-orange-300 text-xl mb-5 font-bold text-center tracking-widest uppercase">
        {esEdicion ? "Editar Artefacto" : "Registrar Artefacto"}
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">

        {/* ── MODO CREACIÓN: categoría primero ── */}
        {!esEdicion && (
          <div>
            <label className={labelClass}>Categoría * (seleccionar primero)</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputClass}>
              <option value="">Seleccionar categoría</option>
              <option value="Transporte">Transporte (10xxxx)</option>
              <option value="Energia">Energía (20xxxx)</option>
              <option value="Defensa">Defensa (30xxxx)</option>
              <option value="Domestica">Doméstica (40xxxx)</option>
            </select>
            {errors.categoria && <p className={errorClass}>{errors.categoria}</p>}
          </div>
        )}

        {/* ── CÓDIGO ── */}
        <div>
          <label className={labelClass}>
            Código ID *
            {!esEdicion && codigoSugerido && (
              <span className="text-orange-400/70 ml-2 normal-case tracking-normal font-normal">
                sugerido: {codigoSugerido}
              </span>
            )}
          </label>

          {/* EDICIÓN: 2 opciones */}
          {esEdicion ? (
            <div className="flex flex-col gap-2">
              {/* Opción mantener */}
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded border border-orange-400/40 hover:border-orange-400 transition">
                <input
                  type="radio"
                  name="opcionCodigo"
                  value="mantener"
                  checked={opcionCodigo === "mantener"}
                  onChange={() => setOpcionCodigo("mantener")}
                  className="accent-orange-400"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{initialData.codigo}</p>
                  <p className="text-orange-400/60 text-xs">Mantener código actual (corrección menor)</p>
                </div>
              </label>

              {/* Opción nueva versión */}
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded border border-orange-400/40 hover:border-orange-400 transition">
                <input
                  type="radio"
                  name="opcionCodigo"
                  value="version"
                  checked={opcionCodigo === "version"}
                  onChange={() => setOpcionCodigo("version")}
                  className="accent-orange-400"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{generarNuevaVersion(initialData.codigo)}</p>
                  <p className="text-orange-400/60 text-xs">Nueva versión (actualización del artefacto)</p>
                </div>
              </label>
            </div>
          ) : (
            /* CREACIÓN: campo editable */
            !categoria ? (
              <>
                <input disabled placeholder="Selecciona categoría primero" className={inputDisabled} />
                <p className="text-orange-400/60 text-xs mt-1">⚠ Debes elegir una categoría para habilitar este campo</p>
              </>
            ) : (
              <>
                <input
                  value={codigo}
                  onChange={e => handleCodigoChange(e.target.value)}
                  className={`${inputClass} ${codigoError ? "border-red-400 focus:ring-red-400" : ""}`}
                  placeholder={codigoSugerido}
                />
                {codigoError
                  ? <p className={errorClass}>{codigoError}</p>
                  : <p className="text-orange-400/60 text-xs mt-1">📋 Formato: {prefijoPorCategoria[categoria]}XXYY — XX invento · YY versión</p>
                }
              </>
            )
          )}
          {errors.codigo && <p className={errorClass}>{errors.codigo}</p>}
        </div>

        {/* ── MODO EDICIÓN: categoría como select normal ── */}
        {esEdicion && (
          <div>
            <label className={labelClass}>Categoría *</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputClass}>
              <option value="">Seleccionar categoría</option>
              <option value="Transporte">Transporte</option>
              <option value="Energia">Energía</option>
              <option value="Defensa">Defensa</option>
              <option value="Domestica">Doméstica</option>
            </select>
            {errors.categoria && <p className={errorClass}>{errors.categoria}</p>}
          </div>
        )}

        {/* Nombre */}
        <div>
          <label className={labelClass}>Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} />
          {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
        </div>

        {/* Fecha */}
        <div>
          <label className={labelClass}>Fecha de Creación *</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
          {errors.fecha && <p className={errorClass}>{errors.fecha}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className={labelClass}>Tipo de Artefacto *</label>
          <input value={tipoArtefacto} onChange={e => setTipoArtefacto(e.target.value)} className={inputClass} />
          {errors.tipoArtefacto && <p className={errorClass}>{errors.tipoArtefacto}</p>}
        </div>

        {/* Inventor */}
        <div>
          <label className={labelClass}>Inventor *</label>
          <input value={inventor} onChange={e => setInventor(e.target.value)} className={inputClass} />
          {errors.inventor && <p className={errorClass}>{errors.inventor}</p>}
        </div>

        {seleccionado && (
          <div className="col-span-2 flex justify-center">
            <img src={seleccionado.gif} className="w-24 drop-shadow-[0_0_10px_orange]" alt={seleccionado.nombre} />
          </div>
        )}

        {/* Necesidad */}
        <div>
          <label className={labelClass}>Necesidad *</label>
          <input value={necesidad} onChange={e => setNecesidad(e.target.value)} className={inputClass} />
          {errors.necesidad && <p className={errorClass}>{errors.necesidad}</p>}
        </div>

        {/* Peligrosidad */}
        <div>
          <label className={labelClass}>Nivel de Peligrosidad *</label>
          <input value={nivelPeligrosidad} onChange={e => setNivelPeligrosidad(e.target.value)} className={inputClass} />
          {errors.nivelPeligrosidad && <p className={errorClass}>{errors.nivelPeligrosidad}</p>}
        </div>

        {/* Origen */}
        <div>
          <label className={labelClass}>Origen *</label>
          <select value={origen} onChange={e => setOrigen(e.target.value)} className={inputClass}>
            <option value="">Seleccionar</option>
            <option value="Terricola">Terrícola</option>
            <option value="Saiyajin">Saiyajin</option>
            <option value="Namekiano">Namekiano</option>
          </select>
          {errors.origen && <p className={errorClass}>{errors.origen}</p>}
        </div>

        {/* Estado */}
        <div>
          <label className={labelClass}>Estado *</label>
          <select value={estado} onChange={e => setEstado(e.target.value)} className={inputClass}>
            <option value="">Seleccionar</option>
            <option value="En desarrollo">En desarrollo</option>
            <option value="En pruebas">En pruebas</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Destruido">Destruido</option>
          </select>
          {errors.estado && <p className={errorClass}>{errors.estado}</p>}
        </div>

        {/* Descripción */}
        <div className="col-span-2">
          <label className={labelClass}>Descripción *</label>
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className={`${inputClass} resize-none h-20`} />
          {errors.descripcion && <p className={errorClass}>{errors.descripcion}</p>}
        </div>

        {/* Imágenes */}
        <div className="col-span-2">
          <label className={labelClass}>Imágenes del artefacto (opcional)</label>
          <input type="file" accept="image/*" multiple onChange={handleImagenes} className="w-full text-orange-300 text-sm" />
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded border border-orange-400" />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* GIF inventor */}
      {seleccionado && (
        <div className="mt-3 flex justify-center">
          <img src={seleccionado.gif} className="w-24 drop-shadow-[0_0_10px_orange]" alt={seleccionado.nombre} />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-orange-400 text-black p-2 rounded font-bold mt-4 hover:bg-orange-500 transition shadow-[0_0_15px_orange]"
      >
        {esEdicion ? "Guardar Cambios" : "Guardar Artefacto"}
      </button>

    </form>
  )
}

export default ArtefactoForm