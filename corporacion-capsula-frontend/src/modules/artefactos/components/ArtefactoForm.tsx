import { useState } from "react"
import bulmaGif from "../../../assets/bulma2.gif"
import geroGif from "../../../assets/DCGero1.gif"

type Props = {
  onSubmit: (data: any) => void
  initialData?: any
}

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
  const [codigo, setCodigo] = useState(initialData?.codigo || "")
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

  const handleImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!codigo.trim()) newErrors.codigo = "Requerido"
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

  // 🔥 ESTILOS DBZ
  const inputClass = "w-full p-2 bg-black/60 border border-orange-400 rounded text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
  const labelClass = "text-orange-300 text-sm mb-1 block font-semibold"
  const errorClass = "text-red-400 text-xs mt-1"
  const fieldClass = "mb-3"

  return (
    <form
      className="bg-orange-900/70 border-4 border-orange-400 p-6 rounded-xl w-full max-w-md shadow-[0_0_25px_orange]"
      onSubmit={handleSubmit}
    >

      <h2 className="text-orange-300 text-xl mb-4 font-bold text-center">
        Registrar Artefacto
      </h2>

      <div className={fieldClass}>
        <label className={labelClass}>Código Identificador *</label>
        <input value={codigo} onChange={e => setCodigo(e.target.value)} className={inputClass} />
        {errors.codigo && <p className={errorClass}>{errors.codigo}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Nombre *</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} />
        {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Descripción *</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className={`${inputClass} resize-none h-20`} />
        {errors.descripcion && <p className={errorClass}>{errors.descripcion}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Fecha *</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
        {errors.fecha && <p className={errorClass}>{errors.fecha}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Tipo *</label>
        <input value={tipoArtefacto} onChange={e => setTipoArtefacto(e.target.value)} className={inputClass} />
        {errors.tipoArtefacto && <p className={errorClass}>{errors.tipoArtefacto}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Categoría *</label>
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputClass}>
          <option value="">Seleccionar</option>
          <option value="Transporte">Transporte</option>
          <option value="Energia">Energía</option>
          <option value="Defensa">Defensa</option>
          <option value="Domestica">Doméstica</option>
        </select>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Inventor *</label>
        <input value={inventor} onChange={e => setInventor(e.target.value)} className={inputClass} />
      </div>

      {seleccionado && (
        <div className="mb-4 flex justify-center">
          <img src={seleccionado.gif} className="w-24 drop-shadow-[0_0_10px_orange]" />
        </div>
      )}

      <div className={fieldClass}>
        <label className={labelClass}>Necesidad *</label>
        <input value={necesidad} onChange={e => setNecesidad(e.target.value)} className={inputClass} />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Peligrosidad *</label>
        <input value={nivelPeligrosidad} onChange={e => setNivelPeligrosidad(e.target.value)} className={inputClass} />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Origen *</label>
        <select value={origen} onChange={e => setOrigen(e.target.value)} className={inputClass}>
          <option value="">Seleccionar</option>
          <option value="Terricola">Terrícola</option>
          <option value="Saiyajin">Saiyajin</option>
          <option value="Namekiano">Namekiano</option>
        </select>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Estado *</label>
        <select value={estado} onChange={e => setEstado(e.target.value)} className={inputClass}>
          <option value="">Seleccionar</option>
          <option value="En desarrollo">En desarrollo</option>
          <option value="En pruebas">En pruebas</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Destruido">Destruido</option>
        </select>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Imágenes</label>
        <input type="file" multiple onChange={handleImagenes} className="w-full text-orange-300 text-sm" />
      </div>

      <button
        type="submit"
        className="w-full bg-orange-400 text-black p-2 rounded font-bold mt-3 hover:bg-orange-500 transition shadow-[0_0_15px_orange]"
      >
        Guardar Artefacto
      </button>

    </form>
  )
}

export default ArtefactoForm