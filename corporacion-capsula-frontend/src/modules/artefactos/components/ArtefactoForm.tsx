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

  const inputClass = "w-full p-2 bg-black/60 border border-cyan-400 rounded text-white placeholder-cyan-700"
  const labelClass = "text-cyan-300 text-sm mb-1 block"
  const errorClass = "text-red-400 text-xs mt-1"
  const fieldClass = "mb-3"

  return (
    <form className="bg-black/40 border border-cyan-400 p-6 rounded-xl w-full max-w-md" onSubmit={handleSubmit}>

      <h2 className="text-cyan-400 text-xl mb-4 font-bold">Registrar Artefacto</h2>

      <div className={fieldClass}>
        <label className={labelClass}>Código Identificador *</label>
        <input placeholder="Ej: ART-001" value={codigo} onChange={e => setCodigo(e.target.value)} className={inputClass} />
        {errors.codigo && <p className={errorClass}>{errors.codigo}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Nombre *</label>
        <input placeholder="Nombre del artefacto" value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} />
        {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Descripción *</label>
        <textarea placeholder="Descripción del artefacto" value={descripcion} onChange={e => setDescripcion(e.target.value)} className={`${inputClass} resize-none h-20`} />
        {errors.descripcion && <p className={errorClass}>{errors.descripcion}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Fecha de Creación *</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
        {errors.fecha && <p className={errorClass}>{errors.fecha}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Tipo de Artefacto *</label>
        <input placeholder="Ej: Cápsula, Robot, Nave..." value={tipoArtefacto} onChange={e => setTipoArtefacto(e.target.value)} className={inputClass} />
        {errors.tipoArtefacto && <p className={errorClass}>{errors.tipoArtefacto}</p>}
      </div>

      <div className={fieldClass}>
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

      <div className={fieldClass}>
        <label className={labelClass}>Inventor *</label>
        <input placeholder="Ej: Bulma, Dr. Gero..." value={inventor} onChange={e => setInventor(e.target.value)} className={inputClass} />
        {errors.inventor && <p className={errorClass}>{errors.inventor}</p>}
      </div>

      {seleccionado && (
        <div className="mb-4 flex justify-center">
          <img src={seleccionado.gif} className="w-24" alt={seleccionado.nombre} />
        </div>
      )}

      <div className={fieldClass}>
        <label className={labelClass}>Necesidad *</label>
        <input placeholder="¿Para qué se creó?" value={necesidad} onChange={e => setNecesidad(e.target.value)} className={inputClass} />
        {errors.necesidad && <p className={errorClass}>{errors.necesidad}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Nivel de Peligrosidad *</label>
        <input placeholder="Ej: Alto, Medio, Bajo" value={nivelPeligrosidad} onChange={e => setNivelPeligrosidad(e.target.value)} className={inputClass} />
        {errors.nivelPeligrosidad && <p className={errorClass}>{errors.nivelPeligrosidad}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Origen *</label>
        <select value={origen} onChange={e => setOrigen(e.target.value)} className={inputClass}>
          <option value="">Seleccionar origen</option>
          <option value="Terricola">Terrícola</option>
          <option value="Saiyajin">Saiyajin</option>
          <option value="Namekiano">Namekiano</option>
        </select>
        {errors.origen && <p className={errorClass}>{errors.origen}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Estado *</label>
        <select value={estado} onChange={e => setEstado(e.target.value)} className={inputClass}>
          <option value="">Seleccionar estado</option>
          <option value="En desarrollo">En desarrollo</option>
          <option value="En pruebas">En pruebas</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Finalizado">Destruido</option>
        </select>
        {errors.estado && <p className={errorClass}>{errors.estado}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Imágenes del artefacto (opcional)</label>
        <input type="file" accept="image/*" multiple onChange={handleImagenes} className="w-full text-cyan-300 text-sm" />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded border border-cyan-400" />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="w-full bg-cyan-400 text-black p-2 rounded font-bold mt-2 hover:bg-cyan-300 transition">
        Guardar Artefacto
      </button>

    </form>
  )
}

export default ArtefactoForm